'use client'
import { Editor } from "@tinymce/tinymce-react";

const EditProductForm: React.FC<any> = ({
  editData,
  setEditdata,
  dataCategory,
  handleImageUpload,
  updateProduct,
  cancelProcess
}) => {
  return (
    <div className="fixed top-0 right-0 w-[400px] h-screen bg-white shadow-lg z-[1000] overflow-y-auto animate-slide-in border-l border-gray-200">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <h2 className="text-lg font-semibold">{editData.id ? 'Edit Product' : 'Create Product'}</h2>
        <button onClick={cancelProcess} className="text-gray-500 hover:text-red-500 text-2xl">&times;</button>
      </div>
      <div className="p-4 space-y-4">

        <div>
          <label className="block text-sm font-medium mb-1">Image Product</label>
          {editData.image && (
            <div className="mb-2">
              <img src={editData.image} alt="Uploaded Product" className="w-20 h-20 object-cover rounded" />
            </div>
          )}
          <input 
            type="file" 
            accept="image/*"
            onChange={(e) => handleImageUpload(e)}
            className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Name Product</label>
          <input
            type="text"
            placeholder="Enter name"
            className="w-full border rounded px-3 py-2 text-sm"
            onChange={(e) => setEditdata({ ...editData, name: e.target.value })}
            value={editData.name}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Price</label>
          <input
            type="number"
            placeholder="Enter price"
            className="w-full border rounded px-3 py-2 text-sm"
            onChange={(e) => setEditdata({ ...editData, price: Number(e.target.value) })}
            value={editData.price}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Quantity</label>
          <input
            type="number"
            placeholder="Enter quantity"
            className="w-full border rounded px-3 py-2 text-sm"
            onChange={(e) => setEditdata({ ...editData, quantity: Number(e.target.value) })}
            value={editData.quantity}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Origin</label>
          <input
            type="text"
            placeholder="Enter origin"
            className="w-full border rounded px-3 py-2 text-sm"
            onChange={(e) => setEditdata({ ...editData, origin: e.target.value })}
            value={editData.origin}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="status"
              onChange={(e) => setEditdata({ ...editData, status: e.target.checked })}
              checked={editData.status}
              className="w-4 h-4"
            />
            <span className="text-sm">{editData.status ? 'Active' : 'Inactive'}</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Discount</label>
          <input
            type="number"
            placeholder="Enter discount"
            className="w-full border rounded px-3 py-2 text-sm"
            onChange={(e) => setEditdata({ ...editData, discount: Number(e.target.value) })}
            value={editData.discount}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <Editor
            apiKey="58ch4vcs9zi0g4x0gfk9dw4w3iib5zjkchtmfju9dw7cckip"
            onChange={(e) => {
              var content = e.target.getContent();
              setEditdata({ ...editData, description: content });
            }}
            initialValue={editData.description}
            init={{
              plugins: [
                'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'image', 'link', 'lists', 'media', 'searchreplace', 'table', 'visualblocks', 'wordcount'
              ],
              toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat'
            }}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <select
            className="w-full border rounded px-3 py-2 text-sm"
            onChange={(e) => setEditdata({ ...editData, category_id: Number(e.target.value) })}
            value={editData.category_id}
          >
            <option value={0}>Choose category</option>
            {dataCategory.map((item: any) => (
              <option key={item.id} value={item.id}>{item.name}</option>
            ))}
          </select>
        </div>

        <div className="flex justify-between gap-4 pt-4">
          <button type="button" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full" onClick={updateProduct}>
            <i className="fa-regular fa-floppy-disk"></i>
          </button>
          <button type="button" className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded w-full" onClick={cancelProcess}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
      </div>

      <style jsx global>{`
        @keyframes slide-in {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default EditProductForm;
