import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { oricleProducts } from "@/data/oricleProducts";
import { Package } from "lucide-react";

const Resources = () => {
  const products99 = oricleProducts.filter((p) => p.marketPrice === 99);
  const products149 = oricleProducts.filter((p) => p.marketPrice === 149);

  const renderGroup = (title: string, items: typeof oricleProducts) => (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">{title}</h2>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((p) => (
          <Card key={p.name} className="hover-scale">
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-lg">{p.name}</CardTitle>
                <Badge variant="secondary">${p.marketPrice}</Badge>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                <Badge>{p.type}</Badge>
                <Badge variant="outline">{p.marketingStatus}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p className="text-muted-foreground">{p.description}</p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                <Info label="On-Market Schedule" value={p.onMarketSchedule} />
                <Info label="Factory Model" value={p.factoryModel} />
                <Info label="Internal SKU" value={p.internalSku} />
                <Info label="Chipset" value={p.chipset} />
                <Info label="Current Inventory" value={p.currentInventory} />
                <Info label="On Order" value={p.onOrder} />
                <Info label="CIC" value={p.cic} />
                <Info label="Channels" value={String(p.channels)} />
                <Info label="Volume Levels" value={String(p.volume)} />
                <Info label="Modes" value={String(p.modes)} />
                <Info label="Start-up Mode" value={p.startUpMode} />
                <Info label="Start-up Delay" value={p.startUpDelay} />
                <Info label="Remove Sticker?" value={p.needRemoveSticker} />
                <Info label="Power" value={p.powerType} />
                <Info label="Screen Display" value={p.screenDisplay ? "Yes" : "No"} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-hero shadow-soft">
          <Package className="h-5 w-5 text-primary-foreground" />
        </span>
        <div>
          <h1 className="text-3xl font-bold">Resources</h1>
          <p className="text-muted-foreground">Oricle product information reference for the team.</p>
        </div>
      </div>

      {renderGroup("$99 Products", products99)}
      {renderGroup("$149 Products", products149)}
    </div>
  );
};

const Info = ({ label, value }: { label: string; value: string }) => (
  <div>
    <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
    <div className="font-medium">{value}</div>
  </div>
);

export default Resources;
