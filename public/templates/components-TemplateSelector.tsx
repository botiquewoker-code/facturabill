'use client';
import { useInvoice } from '@/contexts/InvoiceContext';

const templates = ['modern','elegant','eco','creative','luxury','minimal','dark'];

export default function TemplateSelector() {
  const { setTemplate } = useInvoice();
  return (
    <div className="w-full py-8 overflow-x-auto">
      <div className="flex gap-6 px-4">
        {templates.map(t => (
          <img key={t} src={`/templates/${t}.jpg`} alt={t}
               className="w-80 h-auto rounded-2xl shadow-2xl cursor-pointer hover:scale-105 transition"
               onClick={() => setTemplate(t)} />
        ))}
      </div>
    </div>
  );
}
