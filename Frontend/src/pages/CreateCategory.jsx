import { motion } from "framer-motion";
import CategoryForm from "../components/category/CategoryForm";
import "../styles/createCategory.css";
import BackButton from "../components/common/BackButton";
import { useParams } from "react-router-dom";

const CreateCategory = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);

  return (
    <motion.div
      className="create-category-layout"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <BackButton path="/dashboard" />

      <div className="create-category-container">
        <div className="category-header">
          <h1 className="category-title">
            {isEdit ? "Update Category" : "Create New Category"}
          </h1>{" "}
        </div>

        <motion.div
          className="category-form-card"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <CategoryForm isEdit={isEdit} categoryId={id} />{" "}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CreateCategory;
