"use client";

import { useEffect, useState, useMemo } from "react";
import api from "./api";
import toast from "react-hot-toast";
import Image from "next/image";
import jsPDF from "jspdf";
import {
  PieChart as PieChartIcon,
  ArrowDownCircle,
  ArrowUpCircle,
  Wallet,
  TrendingUp,
  TrendingDown,
  Trash,
  PlusCircle,
  Download,
  X,
} from "lucide-react";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Legend, 
  Tooltip 
} from "recharts";

type Transaction = {
  id: string;
  text: string;
  category: string;
  amount: number;
  created_at: string;
};

const CATEGORIES = ["Food", "Transport", "Utilities", "Entertainment", "Other"];

// Restored to your original format 
const CATEGORY_COLORS: Record<string, [number, number, number]> = {
  Food: [65, 105, 225],       // Royal Blue
  Transport: [0, 191, 255],    // Sky Blue
  Utilities: [34, 139, 34],    // Forest Green
  Entertainment: [255, 165, 0], // Orange
  Other: [128, 128, 128],      // Grey
};

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
  const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" className="text-xs font-bold">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [text, setText] = useState("");
  const [category, setCategory] = useState<string>("Other");
  const [amount, setAmount] = useState<number | "">("");
  const [loading, setLoading] = useState(false);

  const getTransactions = async () => {
    try {
      const res = await api.get<Transaction[]>("transactions/");
      setTransactions(res.data);
    } catch {
      toast.error("Failed to fetch transactions");
    }
  };

  const addTransaction = async () => {
    if (!text || amount === "") {
      toast.error("Invalid input");
      return;
    }
    setLoading(true);
    try {
      await api.post("transactions/", { text, amount, category });
      setText("");
      setAmount("");
      setCategory("Other");
      getTransactions();
      toast.success("Transaction added");
      (document.getElementById("my_modal_3") as HTMLDialogElement)?.close();
    } finally {
      setLoading(false);
    }
  };

  const deleteTransaction = async (id: string) => {
    await api.delete(`transactions/${id}/`);
    getTransactions();
  };

  useEffect(() => {
    getTransactions();
  }, []);

  const amounts = transactions.map((t) => Number(t.amount));
  const balance = amounts.reduce((a, b) => a + b, 0);
  const income = amounts.filter((a) => a > 0).reduce((a, b) => a + b, 0);
  const expense = amounts.filter((a) => a < 0).reduce((a, b) => a + b, 0);

  const chartData = useMemo(() => {
    return CATEGORIES.map(cat => {
      const total = transactions
        .filter(t => t.category === cat)
        .reduce((a, b) => a + Math.abs(Number(b.amount)), 0);
      return { name: cat, value: total };
    }).filter(item => item.value > 0);
  }, [transactions]);

  const formatDate = (d: string) => new Date(d).toLocaleDateString("en-ZA");

  /* ================= PDF EXPORT (EXACTLY AS PER YOUR FILE)  ================= */
  const exportPDF = async () => {
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const leftMargin = 14;

    const sortedTransactions = [...transactions].sort(
      (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );

    const categoryData = CATEGORIES.map(cat => {
      const total = transactions
        .filter(t => t.category === cat)
        .reduce((a, b) => a + Math.abs(Number(b.amount)), 0);
      return { label: cat, value: total, color: CATEGORY_COLORS[cat] };
    });

    const generateChartImage = (): string => {
      const canvas = document.createElement("canvas");
      canvas.width = 400; canvas.height = 400;
      const ctx = canvas.getContext("2d");
      if (!ctx) return "";
      let totalValue = categoryData.reduce((a, b) => a + b.value, 0) || 1;
      let startAngle = 0;
      categoryData.forEach(data => {
        const sliceAngle = (2 * Math.PI * data.value) / totalValue;
        ctx.fillStyle = `rgb(${data.color.join(",")})`;
        ctx.beginPath(); ctx.moveTo(200, 200);
        ctx.arc(200, 200, 180, startAngle, startAngle + sliceAngle);
        ctx.closePath(); ctx.fill();
        startAngle += sliceAngle;
      });
      ctx.fillStyle = "white"; ctx.beginPath(); ctx.arc(200, 200, 100, 0, 2 * Math.PI); ctx.fill();
      return canvas.toDataURL("image/png");
    };

    const chartBase64 = generateChartImage();

    const renderHeader = (isFirstPage: boolean) => {
      pdf.setFontSize(8); pdf.setTextColor(100);
      pdf.text(`Generated: ${new Date().toLocaleString("en-ZA")}`, pageWidth - leftMargin, 10, { align: "right" });
      pdf.addImage("/obics_logo.png", "PNG", leftMargin, 5, 15, 15);

      if (isFirstPage) {
        pdf.setFontSize(18); pdf.setFont("helvetica", "bold"); pdf.setTextColor(0);
        pdf.text("Financial Summary", leftMargin, 30);

        pdf.setFillColor(240, 255, 240); pdf.roundedRect(leftMargin, 35, 75, 22, 3, 3, "F");
        pdf.setDrawColor(34, 139, 34); pdf.setLineWidth(0.5); pdf.circle(leftMargin + 8, 46, 4, "S");
        pdf.setFontSize(10); pdf.setTextColor(34, 139, 34); pdf.text("Income", leftMargin + 15, 43);
        pdf.setFontSize(14); pdf.text(`R ${income.toFixed(2)}`, leftMargin + 15, 51);

        pdf.setFillColor(255, 240, 240); pdf.roundedRect(leftMargin, 60, 75, 22, 3, 3, "F");
        pdf.setDrawColor(220, 20, 60); pdf.circle(leftMargin + 8, 71, 4, "S");
        pdf.setFontSize(10); pdf.setTextColor(220, 20, 60); pdf.text("Expenses", leftMargin + 15, 68);
        pdf.setFontSize(14); pdf.text(`R ${expense.toFixed(2)}`, leftMargin + 15, 76);

        pdf.setFillColor(245, 245, 250); pdf.roundedRect(leftMargin, 85, 75, 22, 3, 3, "F");
        pdf.setDrawColor(0); pdf.circle(leftMargin + 8, 96, 4, "S");
        pdf.setFontSize(10); pdf.setTextColor(0); pdf.text("Balance", leftMargin + 15, 93);
        pdf.setFontSize(14); pdf.text(`R ${balance.toFixed(2)}`, leftMargin + 15, 101);

        pdf.setFontSize(22); pdf.setTextColor(0, 191, 255); pdf.text("STATEMENT", pageWidth / 2 + 10, 25, { align: "center" });
        pdf.setFontSize(12); pdf.setTextColor(0); pdf.text("Category Total", pageWidth - 55, 35, { align: "center" });
        pdf.addImage(chartBase64, "PNG", pageWidth - 80, 40, 50, 50);
        
        categoryData.forEach((d, i) => {
          pdf.setFillColor(d.color[0], d.color[1], d.color[2]);
          pdf.rect(pageWidth - 25, 45 + (i * 6), 3, 3, "F");
          pdf.setFontSize(8); pdf.text(d.label, pageWidth - 20, 48 + (i * 6));
        });
        return 120;
      }
      return 35;
    };

    let yPos = renderHeader(true);

    const drawTableHeader = (y: number) => {
      pdf.setFontSize(12); pdf.setFont("helvetica", "bold"); pdf.setTextColor(0); 
      pdf.text("Date", leftMargin + 2, y);
      pdf.text("Description", 45, y);
      pdf.text("Debit", pageWidth - 85, y);
      pdf.text("Credit", pageWidth - 60, y);
      pdf.text("Balance", pageWidth - 35, y);
      pdf.line(leftMargin, y + 2, pageWidth - leftMargin, y + 2);
      return y + 10;
    };

    yPos = drawTableHeader(yPos);
    let currentPage = 1;
    let runningCalcBalance = 0;
    const totalPages = Math.ceil(sortedTransactions.length / 18) || 1;

    sortedTransactions.forEach((t, index) => {
      if (yPos > 275) {
        pdf.setFontSize(8); pdf.text(`Page ${currentPage} of ${totalPages}`, pageWidth / 2, 290, { align: "center" });
        pdf.addPage();
        currentPage++;
        yPos = drawTableHeader(renderHeader(false));
      }
      const currentAmount = Number(t.amount);
      runningCalcBalance += currentAmount;
      if (index % 2 === 0) { pdf.setFillColor(248, 248, 248); pdf.rect(leftMargin, yPos - 7, pageWidth - (leftMargin * 2), 10, "F"); }
      pdf.setFontSize(10); pdf.setFont("helvetica", "normal"); pdf.setTextColor(0);
      pdf.text(formatDate(t.created_at), leftMargin + 2, yPos);
      pdf.text(pdf.splitTextToSize(t.text, 50)[0], 45, yPos);
      if (currentAmount < 0) {
        pdf.setTextColor(220, 20, 60); pdf.text(`R ${Math.abs(currentAmount).toFixed(2)}`, pageWidth - 85, yPos);
      } else {
        pdf.setTextColor(34, 139, 34); pdf.text(`R ${currentAmount.toFixed(2)}`, pageWidth - 60, yPos);
      }
      pdf.setTextColor(0); pdf.text(`R ${runningCalcBalance.toFixed(2)}`, pageWidth - 35, yPos);
      yPos += 10;
    });

    pdf.text(`Page ${currentPage} of ${totalPages}`, pageWidth / 2, 290, { align: "center" });
    pdf.save("OBICS_Statement.pdf");
    toast.success("Statement Generated");
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <Image src="/obics_logo.png" alt="OBICS" width={36} height={36} />
          <h1 className="text-2xl font-bold">Finance Tracker</h1>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-success" onClick={() => (document.getElementById("my_modal_3") as HTMLDialogElement).showModal()}>
            <PlusCircle className="w-4 h-4" /> Add Transaction
          </button>
          <button className="btn btn-outline" onClick={exportPDF}>
            <Download className="w-4 h-4" /> Export PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Stat title="Income" value={income} icon={<ArrowUpCircle />} color="bg-success/10 text-success border-success/20" />
        <Stat title="Expenses" value={expense} icon={<ArrowDownCircle />} color="bg-error/10 text-error border-error/20" />
        <Stat title="Balance" value={balance} icon={<Wallet />} color="bg-base-200" />
      </div>

      {/* CHART SECTION ABOVE TABLE */}
      <div className="rounded-xl border bg-base-100 p-6">
        <div className="flex items-center gap-2 mb-4">
          <PieChartIcon className="text-primary w-5 h-5" />
          <h2 className="text-lg font-bold">Spending by Category</h2>
        </div>
        <div className="h-[300px] w-full">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%" cy="50%" innerRadius={60} outerRadius={100}
                  paddingAngle={5} dataKey="value" labelLine={false}
                  label={renderCustomizedLabel}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={`rgb(${CATEGORY_COLORS[entry.name].join(",")})`} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(val: number) => `R ${val.toFixed(2)}`}
                  contentStyle={{ backgroundColor: '#1d232a', border: '1px solid #383f47', borderRadius: '8px' }}
                />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-500 italic">No data available</div>
          )}
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border">
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Description</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Date</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {[...transactions].sort((a,b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()).map((t, i) => (
              <tr key={t.id}>
                <td>{i + 1}</td>
                <td>{t.text}</td>
                <td>{t.category || "Other"}</td>
                <td className="flex items-center gap-2">
                  {Number(t.amount) > 0 ? <TrendingUp className="text-success" /> : <TrendingDown className="text-error" />}
                  R {Number(t.amount).toFixed(2)}
                </td>
                <td>{formatDate(t.created_at)}</td>
                <td>
                  <button onClick={() => deleteTransaction(t.id)} className="btn btn-sm btn-error">
                    <Trash className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <dialog id="my_modal_3" className="modal">
        <div className="modal-box">
          <div className="flex justify-between items-center">
            <h3 className="font-bold">New Transaction</h3>
            <button className="btn btn-sm btn-circle btn-ghost" onClick={() => (document.getElementById("my_modal_3") as HTMLDialogElement).close()}>
              <X />
            </button>
          </div>
          <input className="input w-full my-2" placeholder="Description" value={text} onChange={(e) => setText(e.target.value)} />
          <input className="input w-full my-2" type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value === "" ? "" : Number(e.target.value))} />
          <select className="input w-full my-2" value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          <button className="btn btn-success w-full" onClick={addTransaction} disabled={loading}>Save</button>
        </div>
      </dialog>
    </div>
  );
}

function Stat({ title, value, icon, color }: any) {
  return (
    <div className={`rounded-xl border p-4 flex gap-3 items-center ${color}`}>
      {icon}
      <div>
        <p className="text-sm opacity-80">{title}</p>
        <p className="text-xl font-bold">R {Number(value).toFixed(2)}</p>
      </div>
    </div>
  );
}