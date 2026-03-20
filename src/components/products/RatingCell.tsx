export function RatingCell({ value }: { value: number }) {
  const style = value < 3.5 ? { color: 'red' } : undefined
  return <span style={style}>{value}</span>
}
