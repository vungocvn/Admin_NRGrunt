// editProduct.tsx
import { Editor } from '@tinymce/tinymce-react';
import React, { useRef } from 'react';

const EditProductForm: React.FC<any> = ({
  editData,
  setEditdata,
  dataCategory,
  handleImageUpload,
  updateProduct,
  cancelProcess
}) => {
  return (
    <div className="content-form-1">
      <h2>{editData.id ? 'Edit Product' : 'Create Product'}</h2>
      <div className="form-sub">
        <label>Image Product</label>
        {editData.image && <img src={editData.image} alt="Product" width={100} height={100} />}
        <input type="file" onChange={(e) => handleImageUpload(e, setEditdata, editData, alert)} />
      </div>
      <div className="form-sub">
        <label>Name Product</label>
        <input
          type="text"
          placeholder="Enter name"
          onChange={(e) => setEditdata({ ...editData, name: e.target.value })}
          value={editData.name}
        />
      </div>
      <div className="form-sub">
        <label>Price</label>
        <input
          type="text"
          placeholder="Enter price"
          onChange={(e) => setEditdata({ ...editData, price: Number(e.target.value) })}
          value={editData.price}
        />
      </div>
      <div className="form-sub">
        <label>Quantity</label>
        <input
          type="text"
          placeholder="Enter quantity"
          onChange={(e) => setEditdata({ ...editData, quantity: Number(e.target.value) })}
          value={editData.quantity}
        />
      </div>
      <div className="form-sub">
        <label>Origin</label>
        <input
          type="text"
          placeholder="Enter origin"
          onChange={(e) => setEditdata({ ...editData, origin: e.target.value })}
          value={editData.origin}
        />
      </div>
      <div className="form-1">
        <label>Status</label>
        <input
          type="checkbox"
          name="status"
          value="status"
          onChange={(e) => setEditdata({ ...editData, status: e.target.checked })}
          checked={editData.status}
        />
      </div>
      <div className="form-sub">
        <label>Discount</label>
        <input
          type="text"
          placeholder=""
          onChange={(e) => setEditdata({ ...editData, discount: Number(e.target.value) })}
          value={editData.discount}
        />
      </div>
      <div className="form-sub">
        <label>Description</label>
        <Editor
          apiKey='58ch4vcs9zi0g4x0gfk9dw4w3iib5zjkchtmfju9dw7cckip'
          onChange={(e)=>{
            var content = e.target.getContent();
            setEditdata({...editData,description:content})}}
          init={{
            plugins: [
              // Core editing features
              'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'image', 'link', 'lists', 'media', 'searchreplace', 'table', 'visualblocks', 'wordcount',
              'checklist', 'mediaembed', 'casechange', 'export', 'formatpainter', 'pageembed', 'a11ychecker', 'tinymcespellchecker', 'permanentpen', 'powerpaste', 'advtable', 'advcode', 'editimage', 'advtemplate', 'ai', 'mentions', 'tinycomments', 'tableofcontents', 'footnotes', 'mergetags', 'autocorrect', 'typography', 'inlinecss', 'markdown', 'importword', 'exportword', 'exportpdf'
            ],
            toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
            tinycomments_mode: 'embedded',
            tinycomments_author: 'Author name',
            mergetags_list: [
              { value: 'First.Name', title: 'First Name' },
              { value: 'Email', title: 'Email' },
            ],
            ai_request: (request, respondWith) => respondWith.string(() => Promise.reject('See docs to implement AI Assistant')),
          }}
          initialValue={editData.description}
        />
        {/* <input
          type="text"
          placeholder=""
          onChange={(e) => setEditdata({ ...editData, description: e.target.value })}
          value={editData.description}
        /> */}
      </div>
      <div className="form-1">
        <label>Category</label>
        <select
          defaultValue={0}
          onChange={(e) => setEditdata({ ...editData, category_id: Number(e.target.value) })}
          value={editData.category_id}
        >
          <option value={0}>Choose category</option>
          {dataCategory.map((item: any) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </div>
      <div className="update">
        <button type="button" className="btn-update" onClick={updateProduct}>
          <i className="fa-regular fa-floppy-disk"></i>
        </button>
        <button type="button" className="btn-cancel" onClick={cancelProcess}>
          <i className="fa-solid fa-xmark"></i>
        </button>
      </div>
    </div>
  );
};

export default EditProductForm;
