import { useEffect, useMemo, useRef, useState } from 'react';
import { Group, Image as KonvaImage, Layer, Line, Rect, Stage, Text } from 'react-konva';

const canvas = { width: 720, height: 1280 };

function useLoadedImage(src) {
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (!src) {
      setImage(null);
      return;
    }

    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.src = src;
    img.onload = () => setImage(img);
  }, [src]);

  return image;
}

function fileToObjectUrl(file) {
  if (!file) return null;
  return URL.createObjectURL(file);
}

export default function App() {
  const [fields, setFields] = useState({
    brandName: 'RAHUL JEWELLERY',
    dateText: '2 - MARCH - 2026',
    rate22k1g: '₹ 15,565',
    rate22k8g: '₹ 124,520',
    rate18k1g: '₹ 12,785',
    phone: '9946417429',
    address: 'Kammath Lane, Kozhikode',
    footerSub: '9447538501',
    message: 'സ്വർണ വില ഗ്രാമിന് 300 രൂപ കുറഞ്ഞു'
  });

  const [assets, setAssets] = useState({
    backgroundSrc: null,
    logoSrc: null
  });

  const [blocks, setBlocks] = useState({
    logo: { x: 260, y: 80 },
    title: { x: 145, y: 285 },
    datePill: { x: 215, y: 970 },
    rateCard: { x: 65, y: 1020 },
    message: { x: 85, y: 1165 },
    footer: { x: 0, y: 1220 }
  });

  const objectUrlRegistry = useRef([]);

  useEffect(() => () => {
    objectUrlRegistry.current.forEach((url) => URL.revokeObjectURL(url));
  }, []);

  const backgroundImage = useLoadedImage(assets.backgroundSrc);
  const logoImage = useLoadedImage(assets.logoSrc);

  const safeFields = useMemo(
    () => ({
      ...fields,
      brandName: fields.brandName || 'BRAND NAME',
      dateText: fields.dateText || 'DATE',
      rate22k1g: fields.rate22k1g || '₹ 0',
      rate22k8g: fields.rate22k8g || '₹ 0',
      rate18k1g: fields.rate18k1g || '₹ 0',
      phone: fields.phone || '-',
      address: fields.address || '-',
      footerSub: fields.footerSub || '-',
      message: fields.message || '-'
    }),
    [fields]
  );

  const onUpload = (key, file) => {
    const next = fileToObjectUrl(file);
    if (!next) return;
    objectUrlRegistry.current.push(next);
    setAssets((prev) => ({ ...prev, [key]: next }));
  };

  const updateBlock = (key, patch) => {
    setBlocks((prev) => ({ ...prev, [key]: { ...prev[key], ...patch } }));
  };

  return (
    <div className="page">
      <aside className="panel">
        <h1>Jewellery Template Builder</h1>
        <p>Edit dynamic fields and upload customer assets (background + logo).</p>

        <section>
          <h2>Uploads</h2>
          <label>
            Background image
            <input type="file" accept="image/*" onChange={(e) => onUpload('backgroundSrc', e.target.files?.[0])} />
          </label>
          <label>
            Logo image
            <input type="file" accept="image/*" onChange={(e) => onUpload('logoSrc', e.target.files?.[0])} />
          </label>
        </section>

        <section className="grid-fields">
          <h2>Dynamic content</h2>
          <label>
            Brand name
            <input value={fields.brandName} onChange={(e) => setFields((p) => ({ ...p, brandName: e.target.value }))} />
          </label>
          <label>
            Date
            <input value={fields.dateText} onChange={(e) => setFields((p) => ({ ...p, dateText: e.target.value }))} />
          </label>
          <label>
            1GM 22K
            <input value={fields.rate22k1g} onChange={(e) => setFields((p) => ({ ...p, rate22k1g: e.target.value }))} />
          </label>
          <label>
            8GM 22K
            <input value={fields.rate22k8g} onChange={(e) => setFields((p) => ({ ...p, rate22k8g: e.target.value }))} />
          </label>
          <label>
            1GM 18K
            <input value={fields.rate18k1g} onChange={(e) => setFields((p) => ({ ...p, rate18k1g: e.target.value }))} />
          </label>
          <label>
            Phone
            <input value={fields.phone} onChange={(e) => setFields((p) => ({ ...p, phone: e.target.value }))} />
          </label>
          <label>
            Address
            <input value={fields.address} onChange={(e) => setFields((p) => ({ ...p, address: e.target.value }))} />
          </label>
          <label>
            Footer sub text
            <input value={fields.footerSub} onChange={(e) => setFields((p) => ({ ...p, footerSub: e.target.value }))} />
          </label>
          <label>
            Message
            <textarea rows={2} value={fields.message} onChange={(e) => setFields((p) => ({ ...p, message: e.target.value }))} />
          </label>
        </section>
      </aside>

      <main className="canvas-wrap">
        <Stage width={canvas.width} height={canvas.height}>
          <Layer>
            {backgroundImage ? (
              <KonvaImage image={backgroundImage} width={canvas.width} height={canvas.height} />
            ) : (
              <>
                <Rect width={canvas.width} height={canvas.height} fill="#5b3b32" />
                <Rect width={canvas.width} height={canvas.height} fillLinearGradientStartPoint={{ x: 0, y: 0 }} fillLinearGradientEndPoint={{ x: canvas.width, y: canvas.height }} fillLinearGradientColorStops={[0, 'rgba(181,136,95,0.45)', 1, 'rgba(20,17,19,0.55)']} />
              </>
            )}

            <Rect width={canvas.width} height={canvas.height} fill="rgba(15,9,8,0.18)" />

            <Group
              x={blocks.logo.x}
              y={blocks.logo.y}
              draggable
              onDragEnd={(e) => updateBlock('logo', { x: e.target.x(), y: e.target.y() })}
            >
              {logoImage ? (
                <KonvaImage image={logoImage} width={200} height={170} />
              ) : (
                <>
                  <Rect width={200} height={170} cornerRadius={18} fill="rgba(27,44,42,0.55)" stroke="#d7b775" />
                  <Text text="UPLOAD\nLOGO" width={200} align="center" y={56} fontSize={24} fill="#f4e6bf" />
                </>
              )}
            </Group>

            <Group
              x={blocks.title.x}
              y={blocks.title.y}
              draggable
              onDragEnd={(e) => updateBlock('title', { x: e.target.x(), y: e.target.y() })}
            >
              <Text text={safeFields.brandName} width={430} align="center" fontSize={51} fontStyle="bold" fill="#eac36f" />
            </Group>

            <Group
              x={blocks.datePill.x}
              y={blocks.datePill.y}
              draggable
              onDragEnd={(e) => updateBlock('datePill', { x: e.target.x(), y: e.target.y() })}
            >
              <Rect width={290} height={40} fill="#0f4f3d" />
              <Text text={safeFields.dateText} width={290} y={8} align="center" fontSize={33} fill="#e8f0e9" />
            </Group>

            <Group
              x={blocks.rateCard.x}
              y={blocks.rateCard.y}
              draggable
              onDragEnd={(e) => updateBlock('rateCard', { x: e.target.x(), y: e.target.y() })}
            >
              <Rect width={590} height={142} cornerRadius={16} fill="#1d4f46" stroke="#ced8d4" strokeWidth={2} />
              <Text text="TODAY'S GOLD RATE" x={165} y={12} fontSize={37} fill="#e8ecea" />
              <Line points={[18, 52, 572, 52]} stroke="#98a928" strokeWidth={2} />
              <Line points={[196, 66, 196, 124]} stroke="#9db61e" strokeWidth={2} />
              <Line points={[400, 66, 400, 124]} stroke="#9db61e" strokeWidth={2} />

              <Text text={'1GM 22K'} x={34} y={62} fontSize={39} fill="#e6ecea" fontStyle="bold" />
              <Text text={safeFields.rate22k1g} x={34} y={96} fontSize={56} fill="#e6ecea" fontStyle="bold" />

              <Text text={'8GM 22K'} x={232} y={62} fontSize={39} fill="#e6ecea" fontStyle="bold" />
              <Text text={safeFields.rate22k8g} x={216} y={96} fontSize={56} fill="#e6ecea" fontStyle="bold" />

              <Text text={'1GM 18K'} x={426} y={62} fontSize={39} fill="#e6ecea" fontStyle="bold" />
              <Text text={safeFields.rate18k1g} x={416} y={96} fontSize={56} fill="#e6ecea" fontStyle="bold" />
            </Group>

            <Group
              x={blocks.message.x}
              y={blocks.message.y}
              draggable
              onDragEnd={(e) => updateBlock('message', { x: e.target.x(), y: e.target.y() })}
            >
              <Text text={safeFields.message} width={560} align="center" fontSize={50} fill="#f3f4f2" />
            </Group>

            <Group
              x={blocks.footer.x}
              y={blocks.footer.y}
              draggable
              onDragEnd={(e) => updateBlock('footer', { x: e.target.x(), y: e.target.y() })}
            >
              <Rect width={canvas.width} height={60} fill="#f4c07f" />
              <Rect y={5} width={canvas.width} height={165} fill="#5a3d32" />
              <Text text={`☎ ${safeFields.phone}`} x={160} y={42} fontSize={55} fontStyle="bold" fill="#ffffff" />
              <Text text={safeFields.address} x={450} y={34} width={250} fontSize={40} fill="#f2ebe5" />
              <Text text={safeFields.footerSub} x={450} y={84} width={250} fontSize={40} fill="#f2ebe5" />
            </Group>
          </Layer>
        </Stage>
      </main>
    </div>
  );
}
