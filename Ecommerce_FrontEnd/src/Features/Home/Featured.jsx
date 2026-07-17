"use client";

const SectionTitle = ({ title }) => (
  <div className="text-center mb-8 md:mb-10">
    <h2 className="font-serif text-2xl md:text-[28px] text-[#1E2C24] tracking-wide">{title}</h2>
    <div className="flex justify-center mt-3">
      <div className="relative w-24 h-px bg-[#E8DFC6]">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-0.5 bg-[#0B3D2E]" />
      </div>
    </div>
  </div>
);

const featuredItems = [
  {
    id: 1,
    title: "Traditional Kerala Clothings",
    description: "Discover our exquisite collection of handwoven Kerala clothings",
    image: "https://i.pinimg.com/1200x/36/93/e1/3693e1b38a887910e3e5e73dcba78d10.jpg",
    link: "#"
  },
  {
    id: 2,
    title: "Temple Jewellery",
    description: "Authentic temple jewellery for every occasion",
    image: "https://i.pinimg.com/736x/48/17/04/481704d42509255172e0c3225e5d2f42.jpg",
    link: "#"
  }
];

const FeaturedCard = ({ item, onClick }) => {
  return (
    <div
      className="group cursor-pointer relative overflow-hidden rounded-sm"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
    >
      <div className="relative aspect-[4/5] md:aspect-[3/4] overflow-hidden">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <h3 className="font-serif text-xl md:text-2xl text-white mb-2 group-hover:text-[#D4AF37] transition-colors">
            {item.title}
          </h3>
          <p className="text-sm md:text-base text-gray-200 line-clamp-2 mb-4">
            {item.description}
          </p>
          {/* <button className="inline-flex items-center gap-2 text-white text-sm font-medium group-hover:gap-3 transition-all">
            Explore
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button> */}
        </div>
      </div>
    </div>
  );
};

const Featured = ({ onItemClick }) => {
  return (
    <section className="w-full bg-[#FFFDF8] py-10 md:py-14 border-t border-[#E8DFC6]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
        <SectionTitle title="Featured" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {featuredItems.map((item) => (
            <FeaturedCard
              key={item.id}
              item={item}
              onClick={() => onItemClick?.(item.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Featured;
