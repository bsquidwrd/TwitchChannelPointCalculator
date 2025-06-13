export function Slider({ value, onValueChange, min = 0, max = 100, step = 1 }: {
  value: [number],
  onValueChange: (value: [number]) => void,
  min?: number,
  max?: number,
  step?: number
}) {
  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value[0]}
      onChange={(e) => onValueChange([parseInt(e.target.value)])}
      className="w-full"
    />
  );
}