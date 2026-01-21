import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
  const navigate = useNavigate();

  /* =====================
     FORM STATES
  ====================== */
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [price, setPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [stock, setStock] = useState("");
  const [sku, setSku] = useState("");
  const [description, setDescription] = useState("");

  const [thumbnail, setThumbnail] = useState(null);
  const [images, setImages] = useState([]);

  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* =====================
     FETCH CATEGORIES
  ====================== */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(
          "https://artiststation.co.in/foxecom/api/categories",
        );
        const data = await res.json();
        if (res.ok) setCategories(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load categories");
      }
    };

    fetchCategories();
  }, []);

  /* =====================
     FILE HANDLERS
  ====================== */
  const handleThumbnailChange = (e) => {
    setThumbnail(e.target.files[0]);
  };

  const handleImagesChange = (e) => {
    setImages([...e.target.files]);
  };

  /* =====================
     SUBMIT PRODUCT
  ====================== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !categoryId || !price || !thumbnail) {
      setError("Please fill all required fields");
      return;
    }

    if (images.length < 2 || images.length > 10) {
      setError("Please upload between 2 and 10 gallery images");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const token = localStorage.getItem("adminToken");

      const formData = new FormData();
      formData.append("title", title);
      formData.append("categoryId", categoryId);
      formData.append("price", price);
      formData.append("discountPrice", discountPrice);
      formData.append("stock", stock);
      formData.append("sku", sku);
      formData.append("description", description);
      formData.append("thumbnailImage", thumbnail);

      images.forEach((img) => {
        formData.append("images", img);
      });

      const res = await fetch(
        "https://artiststation.co.in/foxecom/api/products",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Product creation failed");
      }

      setSuccess("Product created successfully");

      setTimeout(() => {
        navigate("/admin/products");
      }, 1500);
    } catch (err) {
      console.error(err);
      setError(err.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  /* =====================
     UI
  ====================== */
  return (
    <div className="container-fluid py-4">
      <div className="row justify-content-center">
        <div className="col-xl-8 col-lg-9 col-md-10">
          <div className="card shadow border-0">
            <div className="card-body p-4">
              <h4 className="mb-3 fw-bold">Add Product</h4>

              {error && <div className="alert alert-danger">{error}</div>}
              {success && <div className="alert alert-success">{success}</div>}

              <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Title *</label>
                    <input
                      className="form-control"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Category *</label>
                    <select
                      className="form-select"
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">Price *</label>
                    <input
                      className="form-control"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">Discount Price</label>
                    <input
                      className="form-control"
                      value={discountPrice}
                      onChange={(e) => setDiscountPrice(e.target.value)}
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">Stock</label>
                    <input
                      className="form-control"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">SKU</label>
                    <input
                      className="form-control"
                      value={sku}
                      onChange={(e) => setSku(e.target.value)}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Thumbnail *</label>
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={handleThumbnailChange}
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label">
                      Gallery Images (2–10) *
                    </label>
                    <input
                      type="file"
                      className="form-control"
                      multiple
                      accept="image/*"
                      onChange={handleImagesChange}
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label">Description</label>
                    <textarea
                      rows="4"
                      className="form-control"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                </div>

                <div className="d-flex justify-content-end mt-4">
                  <div className="col-12 d-flex gap-2 mt-3">
                     <button
                    type="submit"
                    className="btn btn-primary px-4"
                    disabled={loading}
                  >
                    {loading ? "Uploading..." : "Create Product"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => navigate(-1)}
                  >
                    Cancel
                  </button>

                  </div>
                 

                  {/* <div className="col-12 d-flex gap-2 mt-3">
         
         
        </div> */}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
