export default function InfoItem({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-sm bg-secondary/5 border border-secondary/5">
      <div className="text-side-2 mt-1 shrink-0">{icon}</div>
      <div>
        <p className="text-sm text-secondary/60 font-secondary mb-1">{label}</p>
        <p className="font-bold text-secondary font-primary text-lg">{value}</p>
      </div>
    </div>
  );
}
