# GST Invoice Generator

A standalone React application for generating professional GST tax invoices from CSV/Excel files.

## Features

✅ **Upload CSV or Excel Files** - Supports both .csv, .xlsx, and .xls formats
✅ **Batch Invoice Generation** - Generate multiple invoices at once
✅ **Professional PDF Output** - Clean, formatted tax invoices
✅ **Sample CSV Download** - Get sample files to understand the format
✅ **ZIP Download** - Download all invoices as a single ZIP file
✅ **Modal Preview** - Preview invoices before downloading
✅ **Responsive Design** - Works on desktop, tablet, and mobile
✅ **Modern UI** - Beautiful gradient design with smooth animations

## Installation

### 1. Install Dependencies

```bash
npm install papaparse file-saver xlsx pdf-lib jszip lucide-react
```

### 2. Project Structure

```
your-project/
├── src/
│   ├── GSTInvoiceGenerator.jsx
│   └── GSTInvoiceGenerator.css
├── public/
│   └── img/
│       ├── logo.png
│       ├── qr_code.png
│       └── signature.png
└── package.json
```

### 3. Add Required Images

Place the following images in your `public/img/` folder:

- **logo.png** - Company logo (140x55 px recommended)
- **qr_code.png** - QR code for payment (70x70 px recommended)
- **signature.png** - Authorized signature (90x90 px recommended)

## Usage

### Import the Component

```jsx
import GSTInvoiceGenerator from "./GSTInvoiceGenerator";
import "./GSTInvoiceGenerator.css";

function App() {
  return <GSTInvoiceGenerator />;
}

export default App;
```

### CSV File Format

#### CSV 1 - Invoice Data

Required columns:

- `invoice_no` - Invoice number
- `date` - Invoice date (DD.MM.YYYY format)
- `order_id` - Order ID
- `tour/trip` - Tour/Trip description
- `customer_pan` - Customer PAN number
- `customer_gst` - Customer GST number
- `customer_address` - Address (format: Name.City.State.India.Pincode)
- `unit` - Number of units
- `price` - Price per unit
- `dollar_rate` - USD to INR conversion rate (optional)
- `gst` - GST rate (9 or 18)

#### CSV 2 - Passenger Data

Required columns:

- `plan_name` - Plan/Service name (only for first passenger of each invoice)
- `passenger_name` - Passenger name
- `identity_type` - Identity type (e.g., "pp" for passport)
- `identity_no` - Identity number
- `icc_id` - ICC ID
- `invoice_no` - Invoice number (must match CSV 1)

### Example Data

**CSV 1:**

```csv
invoice_no,date,order_id,tour/trip,customer_pan,customer_gst,customer_address,unit,price,dollar_rate,gst
inv123456,24.12.2025,abc-123,thailand trip,ABCDE1234F,09ABCDE1234F1Z1,JOHN DOE.Mumbai.Maharashtra.India.400001,2,720,83.5,18
```

**CSV 2:**

```csv
plan_name,passenger_name,identity_type,identity_no,icc_id,invoice_no
eSim - IND-THA 2GB/Day 5days,JOHN DOE,pp,A12345678,Z-8948010000074359605,inv123456
,JANE DOE,pp,A87654321,Z-8948010000074359606,inv123456
```

## Features in Detail

### 1. File Upload

- Drag and drop or click to upload
- Supports CSV and Excel formats
- Visual feedback when files are uploaded

### 2. Sample CSV Templates

- Click "View Sample CSV 1" or "View Sample CSV 2"
- Preview the data structure
- Download sample files directly

### 3. Invoice Generation

- Click "Generate GST Invoices"
- Progress indicator during generation
- Automatic matching of passengers to invoices

### 4. Preview & Download

- Modal opens with all generated invoices
- Preview each invoice in the browser
- Download individual invoices or all as ZIP

### 5. Reset Functionality

- Clear all uploaded files
- Reset the form to start fresh

## Customization

### Company Details

Edit these constants in `GSTInvoiceGenerator.jsx`:

```javascript
const FIXED_GSTIN = "09AAHCC5468N1ZY";
const FIXED_PAN = "AAHCC5468N";
```

And update company address in the PDF generation function:

```javascript
page.drawText("ConnectingIT Technologies Pvt. Ltd.", ...);
page.drawText("Plot No 20 , 2nd Floor", ...);
// etc.
```

### Styling

Modify colors and styles in `GSTInvoiceGenerator.css`:

```css
/* Primary gradient */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Success gradient */
background: linear-gradient(135deg, #10b981 0%, #059669 100%);
```

## Browser Compatibility

- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge

## Troubleshooting

### Images Not Loading

Make sure images are in `public/img/` folder and paths are correct:

```javascript
const logoImg = await embedImage(pdfDoc, "./img/logo.png");
```

### CSV Parse Errors

- Check that column names exactly match the required format
- Ensure there are no extra spaces in column names
- Verify date format is DD.MM.YYYY

### Invoice Not Generated

- Make sure both CSV files are uploaded
- Check that `invoice_no` in CSV 2 matches CSV 1
- Verify all required columns are present

## License

This is a standalone project. Feel free to use and modify as needed.

## Support

For issues or questions:

1. Check that all dependencies are installed
2. Verify CSV format matches requirements
3. Ensure images are in correct location
4. Check browser console for error messages

---

**Version:** 1.0.0  
**Last Updated:** January 2026
