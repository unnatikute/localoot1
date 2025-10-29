export default function TrendingBanner({ image, title, subtitle }) {
  return (
    <div className="relative rounded-xl overflow-hidden h-48 mb-6">
      {image && <img src={image} alt={title} className="absolute inset-0 w-full h-full object-cover" />}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/20"></div>
      <div className="relative z-10 p-6 text-white">
        <h2 className="text-2xl font-bold">{title}</h2>
        {subtitle && <p className="opacity-90">{subtitle}</p>}
      </div>
    </div>
  );
}


