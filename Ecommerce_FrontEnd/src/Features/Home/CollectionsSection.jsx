"use client";

const SectionTitle = ({ title }) => (
  <div className="text-center mb-10 md:mb-12">
    <h2 className="font-serif text-2xl md:text-[28px] text-gray-900 tracking-wide">{title}</h2>
    <div className="flex justify-center mt-3">
      <div className="relative w-24 h-px bg-gray-300">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-0.5 bg-gray-900" />
      </div>
    </div>
  </div>
);

const CollectionCard = ({ name, image, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex flex-col items-center gap-3 md:gap-4 group flex-shrink-0 w-[100px] sm:w-[120px] md:w-auto md:flex-1"
  >
    <div className="p-[3px] rounded-full border border-[#c9a86c]/80 transition-transform duration-300 group-hover:scale-105">
      <div className="p-[3px] rounded-full border border-[#c9a86c]/60 bg-white">
        <div className="w-[88px] h-[88px] sm:w-[100px] sm:h-[100px] md:w-[110px] md:h-[110px] lg:w-[120px] lg:h-[120px] rounded-full overflow-hidden bg-[#f5f0eb]">
          <img
            src={image || "/placeholder.svg"}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>
      </div>
    </div>
    <span className="font-serif text-xs sm:text-sm text-gray-800 text-center leading-snug max-w-[110px] capitalize">
      {name}
    </span>
  </button>
);

const CollectionsSection = ({ categories = [], onCategoryClick }) => {
  if (categories.length === 0) return null;

  return (
    <section className="w-full bg-white py-10 md:py-14">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
        <SectionTitle title="Collections" />

        <div className="flex md:justify-between items-start gap-6 md:gap-4 overflow-x-auto pb-2 scrollbar-hide md:overflow-visible">
          {categories.map((category) => (
            <CollectionCard
              key={category.name}
              name={category.name}
              image={category.image}
              onClick={() => onCategoryClick(category.name)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CollectionsSection;
