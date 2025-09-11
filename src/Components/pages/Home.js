import Misc from "../lib/data/layout.json";
import HeroArea from "../home/HeroArea";
import FeaturedPromo from "../home/FeaturedPromo";
import CategoriesList from "../home/CategoriesList";
import DiscountOffers from "../home/DiscountOffers";
import HighlightedPromo from "../home/HighlightedPromo";
import ProductsRow from "../home/ProductsRow";
const Home = () => {
  const productItems = Misc.filter((item) => item.type === 77).map((el) => ({
    data: el.data,
    objects: el.objects,
  }));

  return (
    <div className="_container">
      <HeroArea />
      <FeaturedPromo />
      <CategoriesList />
      <DiscountOffers />
      <HighlightedPromo />
      {productItems.map((products, i) => (
        <ProductsRow key={i} {...products} />
      ))}
    </div>
  );
};

export default Home;
