import { useParams } from "react-router-dom";
import CategoryPost from "./CategoryPost";

const WrappedCategoryPost = () => {
  const { id } = useParams();
  return <CategoryPost key={id} />;
};

export default WrappedCategoryPost;
