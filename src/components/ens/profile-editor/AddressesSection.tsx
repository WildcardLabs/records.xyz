
import { Input } from "@/components/ui/input";

interface AddressesSectionProps {
  records: {
    ethereum: string;
    optimism: string;
    base: string;
    arbitrum: string;
    linea: string;
    polygon: string;
  };
  onRecordChange: (field: string, value: string) => void;
}

export function AddressesSection({ records, onRecordChange }: AddressesSectionProps) {
  return (
    <div className="space-y-3">
      {[
        { name: 'Ethereum', key: 'ethereum', icon: "/lovable-uploads/626dbac5-49c0-425d-8996-4213b368d104.png" },
        { name: 'Optimism', key: 'optimism', icon: "/lovable-uploads/d340be2e-c06a-4ac9-b180-4eedc1439f4f.png" },
        { name: 'Base', key: 'base', icon: "/lovable-uploads/704c1ede-df6b-4911-af43-2d274d033df6.png" },
        { name: 'Arbitrum', key: 'arbitrum', icon: "/lovable-uploads/ecaff6c4-37dd-4440-b585-dcf98a2440cf.png" },
        { name: 'Linea', key: 'linea', icon: "/lovable-uploads/b871bebc-5864-440b-b642-101a2728678f.png" },
        { name: 'Polygon', key: 'polygon', icon: "/lovable-uploads/70e574c2-77c3-4ced-a446-d98951501fb1.png" },
      ].map(({ name, key, icon }) => (
        <div key={key} className="group relative flex items-center gap-3 p-3 bg-muted/30 border border-border/20 rounded-lg hover:border-primary/30 transition-colors">
          <div className="flex items-center gap-3 min-w-[120px]">
            <div className="w-8 h-8 rounded-lg bg-muted/30 p-1.5">
              <img src={icon} alt={name} className="w-full h-full" />
            </div>
            <span className="text-base font-medium">{name}</span>
          </div>
          <Input
            value={String(records[key as keyof typeof records])}
            onChange={(e) => onRecordChange(key, e.target.value)}
            placeholder="0x..."
            className="bg-muted/30 text-base border-border/20"
          />
        </div>
      ))}
    </div>
  );
}
