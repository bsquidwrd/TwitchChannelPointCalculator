import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

export default function ChannelPointsCalculator() {
  const [currentPoints, setCurrentPoints] = useState(0);
  const [targetPoints, setTargetPoints] = useState(1_000_000);
  const [hoursPerDay, setHoursPerDay] = useState(5);
  const [subTier, setSubTier] = useState<0 | 1 | 2 | 3>(1);
  const [includeRaids, setIncludeRaids] = useState(true);
  const [includeBits, setIncludeBits] = useState(true);
  const [includeGiftSubs, setIncludeGiftSubs] = useState(true);
  const [includeWatchStreak, setIncludeWatchStreak] = useState(true);
  const [watchStreakDays, setWatchStreakDays] = useState(5);
  const [dailyPoints, setDailyPoints] = useState(0);
  const [daysRequired, setDaysRequired] = useState(0);

  const calculate = () => {
    const basePtsPerHr = 120; // 10 pts/5min
    let subMult = 1.0;
    if (subTier === 1) subMult = 1.2;
    else if (subTier === 2) subMult = 1.5;
    else if (subTier === 3) subMult = 2.0;

    const watchPts = basePtsPerHr * subMult * hoursPerDay;
    const chestPts = 200 * hoursPerDay;
    const streakPts = includeWatchStreak ? [300, 350, 400, 450][watchStreakDays - 2] || 0 : 0;
    const raidPts = includeRaids ? 250 : 0;
    const bitsPts = includeBits ? (1 / 30) * 350 : 0; // once every 30 days
    const giftSubPts = includeGiftSubs ? (1 / 30) * 500 : 0; // once every 30 days

    const totalDaily = Math.floor(
      watchPts + chestPts + streakPts + raidPts + bitsPts + giftSubPts
    );
    setDailyPoints(totalDaily);

    const remaining = Math.max(0, targetPoints - currentPoints);
    const days = Math.ceil(remaining / totalDaily || 1);
    setDaysRequired(days);
  };

  return (
    <div className="p-6 space-y-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold">Twitch Channel Points Calculator</h1>
      <Card>
        <CardContent>
          <div>
            <Label>Current Points</Label>
            <Input type="number" value={currentPoints} onChange={e => setCurrentPoints(Number(e.target.value))}/>
          </div>
          <div>
            <Label>Target Points</Label>
            <Input type="number" value={targetPoints} onChange={e => setTargetPoints(Number(e.target.value))}/>
          </div>
          <div>
            <Label>Hours Watched Per Day: {hoursPerDay}</Label>
            <Slider min={1} max={24} step={1} value={[hoursPerDay]} onValueChange={val => setHoursPerDay(val[0])}/>
          </div>
          <div>
            <Label>Subscription Tier</Label>
            <select value={subTier} onChange={e => setSubTier(Number(e.target.value) as 0 | 1 | 2 | 3)}>
              <option value={0}>Not Subscribed (×1.0)</option>
              <option value={1}>Tier 1 (×1.2)</option>
              <option value={2}>Tier 2 (×1.5)</option>
              <option value={3}>Tier 3 (×2.0)</option>
            </select>
          </div>
          <div className="flex flex-col space-y-2">
            <label><input type="checkbox" checked={includeRaids} onChange={() => setIncludeRaids(!includeRaids)} /> Include raid (+250/day)</label>
            <label><input type="checkbox" checked={includeBits} onChange={() => setIncludeBits(!includeBits)} /> Include first cheer (+350 every 30 days)</label>
            <label><input type="checkbox" checked={includeGiftSubs} onChange={() => setIncludeGiftSubs(!includeGiftSubs)} /> Include first gifted sub (+500 every 30 days)</label>
            <label><input type="checkbox" checked={includeWatchStreak} onChange={() => setIncludeWatchStreak(!includeWatchStreak)} /> Include watch streak bonus</label>
            {includeWatchStreak && (
              <div>
                <Label>Watch Streak Days</Label>
                <select value={watchStreakDays} onChange={e => setWatchStreakDays(Number(e.target.value))}>
                  <option value={2}>2 days (+300)</option>
                  <option value={3}>3 days (+350)</option>
                  <option value={4}>4 days (+400)</option>
                  <option value={5}>5 days (+450)</option>
                </select>
              </div>
            )}
          </div>
          <Button onClick={calculate}>Calculate</Button>

          {dailyPoints > 0 && (
            <div className="pt-4 space-y-2">
              <p><strong>Estimated Daily Points:</strong> {dailyPoints.toLocaleString()}</p>
              <p><strong>Days to Reach Goal:</strong> {daysRequired.toLocaleString()}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
