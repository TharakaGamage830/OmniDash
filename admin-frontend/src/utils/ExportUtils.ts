import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const exportToCSV = (data: any[], filename: string, headers: string[]) => {
    const csvContent = [
        headers.join(','),
        ...data.map(row => headers.map(header => {
            const cellValue = row[header] !== undefined ? row[header] : '';
            // Escape quotes and wrap in quotes if contains comma
            const stringValue = String(cellValue).replace(/"/g, '""');
            return stringValue.includes(',') ? `"${stringValue}"` : stringValue;
        }).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export const exportToPDF = (data: any[], filename: string, title: string, headers: string[], keys: string[]) => {
    const doc = new jsPDF() as any;

    doc.setFontSize(18);
    doc.text(title, 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);

    const tableData = data.map(item => keys.map(key => {
        const val = item[key];
        return val !== undefined && val !== null ? String(val) : '';
    }));

    doc.autoTable({
        head: [headers],
        body: tableData,
        startY: 35,
        theme: 'grid',
        styles: { fontSize: 8, cellPadding: 3 },
        headStyles: { fillColor: [79, 70, 229], textColor: 255 }, // Indigo-600 color
        alternateRowStyles: { fillColor: [249, 250, 251] }
    });

    doc.save(`${filename}.pdf`);
};
