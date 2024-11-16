"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../components/sidebar/sidebar";
import { getAccessTokenFromCookie } from "@/app/api/services/cookieService";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { useLoading } from "@/contexts/LoadingContext";
import Card from "../components/card/card";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import ReceiptIcon from "@mui/icons-material/Receipt";
import PaidIcon from "@mui/icons-material/Paid";
import { TransactionType } from "@/types/transaction";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import MoneyOffIcon from "@mui/icons-material/MoneyOff";
import SearchIcon from "@mui/icons-material/Search";
import ClearAllIcon from "@mui/icons-material/ClearAll";

export default function Home() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [transactions, setTransactions] = useState<TransactionType[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<
    TransactionType[]
  >([]);
  const [page, setPage] = useState(1);
  const [totalRevenue, setTotalRevenue] = useState("0.00");
  const [totalExpenses, setTotalExpenses] = useState("0.00");
  const [pendingTransactions, setPendingTransactions] = useState("0.00");
  const [balance, setBalance] = useState("0.00");
  const [filter, setFilter] = useState({
    amount: "",
    date: "",
    industry: "",
    state: "",
  });
  const { setLoading } = useLoading();
  const ufs = [
    { key: "AC", value: "Acre" },
    { key: "AL", value: "Alagoas" },
    { key: "AP", value: "Amapá" },
    { key: "AM", value: "Amazonas" },
    { key: "BA", value: "Bahia" },
    { key: "CE", value: "Ceará" },
    { key: "DF", value: "Distrito Federal" },
    { key: "ES", value: "Espírito Santo" },
    { key: "GO", value: "Goiás" },
    { key: "MA", value: "Maranhão" },
    { key: "MT", value: "Mato Grosso" },
    { key: "MS", value: "Mato Grosso do Sul" },
    { key: "MG", value: "Minas Gerais" },
    { key: "PA", value: "Pará" },
    { key: "PB", value: "Paraíba" },
    { key: "PR", value: "Paraná" },
    { key: "PE", value: "Pernambuco" },
    { key: "PI", value: "Piauí" },
    { key: "RJ", value: "Rio de Janeiro" },
    { key: "RN", value: "Rio Grande do Norte" },
    { key: "RS", value: "Rio Grande do Sul" },
    { key: "RO", value: "Rondônia" },
    { key: "RR", value: "Roraima" },
    { key: "SC", value: "Santa Catarina" },
    { key: "SP", value: "São Paulo" },
    { key: "SE", value: "Sergipe" },
    { key: "TO", value: "Tocantins" },
  ];

  useEffect(() => {
    const fetchToken = async () => {
      const data = await getAccessTokenFromCookie();
      if (data?.success) {
        setToken(data.token);
      } else {
        router.push("/");
      }
    };

    fetchToken();
  }, []);

  useEffect(() => {
    if (!token) return;
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/data");
        if (!response.ok) {
          throw new Error("Erro ao buscar transações da API");
        }
        const allTransactions = await response.json();
        setTransactions(allTransactions);
        setFilteredTransactions(allTransactions.slice(0, 10));
        calculateMetrics(allTransactions);
      } catch (err) {
        console.error("Error fetching transactions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [token]);

  const toggleSidebar = () => setIsSidebarCollapsed((prev) => !prev);

  const handleFilterChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setFilter((prevFilter) => ({
      ...prevFilter,
      [name]: value,
    }));
  };

  const applyFilter = async () => {
    setLoading(true);

    setTimeout(() => {
      const filtered = transactions.filter((transaction) => {
        const isAmountMatch = transaction.amount
          .toString()
          .startsWith(filter.amount);
        const isDateMatch = transaction.date.startsWith(filter.date);
        const isIndustryMatch = transaction.industry
          .toLowerCase()
          .startsWith(filter.industry.toLowerCase());
        const isStateMatch = transaction.state
          .toUpperCase()
          .startsWith(filter.state.toUpperCase());

        return isAmountMatch && isDateMatch && isIndustryMatch && isStateMatch;
      });

      setFilteredTransactions(filtered.slice(0, 10));
      setLoading(false);
    }, 1000);
  };

  const limpaFiltros = () => {
    setFilteredTransactions(transactions.slice(0, 10));
    setFilter({
      amount: "",
      date: "",
      industry: "",
      state: "",
    });
  };

  const loadMoreTransactions = () => {
    setPage((prevPage) => {
      const nextPage = prevPage + 1;
      const nextTransactions = transactions.slice(
        nextPage * 10 - 10,
        nextPage * 10
      );
      setFilteredTransactions((prev) => [...prev, ...nextTransactions]);
      return nextPage;
    });
  };

  const formatAmount = (amount: number): string => {
    const amountInReais = amount / 100;

    return amountInReais.toLocaleString("pt-BR", {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const calculateMetrics = (transactionBatch: TransactionType[]) => {
    let revenue = 0;
    let expenses = 0;
    let pending = 0;
    const now = new Date();

    transactionBatch.forEach((transaction) => {
      const amount = parseInt(transaction.amount);

      if (transaction.transaction_type === "deposit") {
        revenue += amount;
      } else if (transaction.transaction_type === "withdraw") {
        expenses += amount;
      }

      if (new Date(transaction.date) > now) {
        pending += amount;
      }
    });

    setTotalRevenue(formatAmount(revenue));
    setTotalExpenses(formatAmount(expenses));
    setPendingTransactions(formatAmount(pending));
    setBalance(formatAmount(revenue - expenses));
  };

  return (
    <div className="flex h-full overflow-y-auto">
      {token ? (
        <>
          <div
            className={`transition-all duration-300 bg-ft-tertiary ${
              isSidebarCollapsed ? "w-20" : "w-48"
            }`}
          >
            <Sidebar isCollapsed={isSidebarCollapsed} />
          </div>
          <button
            type="button"
            onClick={toggleSidebar}
            className={`fixed top-2 transition-all duration-300 p-4 bg-ft-primary rounded-full ${
              isSidebarCollapsed ? "left-[3.5rem]" : "left-[10.5rem]"
            }`}
          >
            {isSidebarCollapsed ? <ChevronRight /> : <ChevronLeft />}
          </button>
          <div className="flex-1 bg-ft-primary">
            <div className="mx-auto h-full flex flex-col items-baseline p-16 overflow-y-auto">
              <div className="flex gap-8 flex-wrap p-3">
                <Card
                  title="Receitas"
                  content={totalRevenue}
                  icon={ReceiptIcon}
                ></Card>
                <Card
                  title="Despesas"
                  content={totalExpenses}
                  icon={MoneyOffIcon}
                ></Card>
                <Card
                  title="Transações pendentes"
                  content={pendingTransactions}
                  icon={PaidIcon}
                ></Card>
                <Card
                  title="Saldo"
                  content={balance}
                  icon={AccountBalanceWalletIcon}
                ></Card>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 p-2 w-full">
                <div className="grid">
                  <label htmlFor="date">Data</label>
                  <input
                    type="date"
                    name="date"
                    value={filter.date}
                    onChange={handleFilterChange}
                    className="bg-ft-primary p-2 border rounded-md placeholder:text-ft-platinum outline-none"
                  />
                </div>
                <div className="grid">
                  <label htmlFor="amount">Valor</label>
                  <input
                    type="text"
                    name="amount"
                    value={filter.amount}
                    onChange={handleFilterChange}
                    className="bg-ft-primary p-2 border rounded-md placeholder:text-ft-platinum outline-none"
                  />
                </div>
                <div className="grid">
                  <label htmlFor="industry">Indústria</label>
                  <input
                    type="text"
                    name="industry"
                    value={filter.industry}
                    onChange={handleFilterChange}
                    className="bg-ft-primary p-2 border rounded-md placeholder:text-ft-platinum outline-none"
                  />
                </div>
                <div className="grid">
                  <label htmlFor="state">Estado</label>
                  <select
                    name="state"
                    value={filter.state}
                    onChange={handleFilterChange}
                    className="bg-ft-primary p-2 border rounded-md placeholder:text-ft-platinum outline-none"
                  >
                    <option value="">Selecione</option>
                    {ufs.map((uf) => (
                      <option key={uf.key} value={uf.key}>
                        {uf.value}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={applyFilter}
                    className="bg-ft-secondary text-white rounded-md px-4 mt-6 w-1/2"
                  >
                    <SearchIcon />
                  </button>
                  <button
                    type="button"
                    onClick={limpaFiltros}
                    className="bg-ft-secondary text-white rounded-md px-4 mt-6 w-1/2"
                  >
                    <ClearAllIcon />
                  </button>
                </div>
              </div>
              {filteredTransactions.length ? (
                <>
                  <table className="min-w-full bg-ft-primary mt-8">
                    <thead>
                      <tr className="border-b">
                        <th className="px-4 py-2 text-left">Conta</th>
                        <th className="px-4 py-2 text-left">Data</th>
                        <th className="px-4 py-2 text-left">Valor</th>
                        <th className="px-4 py-2 text-left">Indústria</th>
                        <th className="px-4 py-2 text-left">Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTransactions.map((transaction, idx) => (
                        <tr key={idx} className="border-b">
                          <td className="px-4 py-2">{transaction.account}</td>
                          <td className="px-4 py-2">
                            {transaction.date.split("T")[0] +
                              " | " +
                              transaction.date.split("T")[1].slice(0, -1)}
                          </td>
                          <td
                            className={`px-4 py-2 ${
                              transaction.transaction_type === "deposit"
                                ? "text-green-500"
                                : "text-red-600"
                            }`}
                          >
                            <AttachMoneyIcon />
                            {`
                            ${
                              formatAmount(parseInt(transaction.amount)) +
                              " " +
                              transaction.currency
                            }`}
                          </td>
                          <td className="px-4 py-2">{transaction.industry}</td>
                          <td className="px-4 py-2">{transaction.state}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <button
                    type="button"
                    onClick={loadMoreTransactions}
                    className="bg-ft-primary text-white rounded-md px-4 py-2 mt-4"
                  >
                    Carregar mais
                  </button>
                </>
              ) : (
                <p>Sem transações</p>
              )}
            </div>
          </div>
        </>
      ) : (
        <p>Carregando...</p>
      )}
    </div>
  );
}
