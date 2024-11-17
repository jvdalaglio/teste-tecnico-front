import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { format, startOfWeek, subWeeks, endOfWeek } from "date-fns";
import { parseISO } from "date-fns/parseISO";
import { ApexOptions } from "apexcharts";
import { useLoading } from "@/contexts/LoadingContext";
import { CircularProgress } from "@mui/material";

export default function Charts({ data }: any) {
  const [chartData, setChartData] = useState<{
    deposits: { x: string; y: number }[];
    withdrawals: { x: string; y: number }[];
  }>({
    deposits: [],
    withdrawals: [],
  });
  const { setLoading } = useLoading();

  useEffect(() => {
    if (data && data.length > 0) {
      const lastWeekData = filterLastWeekData(data);
      const newChartData = processData(lastWeekData);
      setChartData(newChartData);
      setLoading(false);
    }
  }, [data]);

  const options: ApexOptions = {
    chart: {
      type: "bar",
      foreColor: "#fff",
    },
    fill: {
      colors: ["#F44336", "#E91E63", "#9C27B0"],
    },
    plotOptions: {
      bar: {
        horizontal: false,
      },
    },
    series: [
      {
        name: "Receitas",
        data: chartData.deposits,
        color: "#4CAF50",
      },
      {
        name: "Despesas",
        data: chartData.withdrawals,
        color: "#F44336",
      },
    ],
  };

  const filterLastWeekData = (data: any) => {
    const now = new Date();
    const oneWeekAgo = subWeeks(now, 1);

    const startOfLastWeek = startOfWeek(oneWeekAgo, { weekStartsOn: 0 });
    const endOfLastWeek = endOfWeek(oneWeekAgo, { weekStartsOn: 0 });

    return data.filter((item: any) => {
      const itemDate = parseISO(item.date);
      return itemDate >= startOfLastWeek && itemDate <= endOfLastWeek;
    });
  };

  const processData = (data: any) => {
    const groupedData = {
      deposits: {} as { [key: string]: number },
      withdrawals: {} as { [key: string]: number },
    };

    data.forEach((item: any) => {
      const dateKey = format(parseISO(item.date), "yyyy-MM-dd");

      const amount = parseInt(item.amount, 10) / 100;
      const transactionType = item.transaction_type;

      if (transactionType === "deposit") {
        if (!groupedData.deposits[dateKey]) {
          groupedData.deposits[dateKey] = 0;
        }
        const totalDeposits = (groupedData.deposits[dateKey] += amount);
      } else if (transactionType === "withdraw") {
        if (!groupedData.withdrawals[dateKey]) {
          groupedData.withdrawals[dateKey] = 0;
        }
        groupedData.withdrawals[dateKey] += amount;
      }
    });

    const deposits = Object.entries(groupedData.deposits)
      .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
      .map(([key, value]) => {
        const formatValue = value.toFixed(2);
        return {
          x: key,
          y: parseFloat(formatValue),
        };
      });

    const withdrawals = Object.entries(groupedData.withdrawals)
      .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
      .map(([key, value]) => {
        const formatValue = value.toFixed(2);
        return {
          x: key,
          y: parseFloat(formatValue),
        };
      });

    return { deposits, withdrawals };
  };

  return chartData.deposits.length > 0 || chartData.withdrawals.length > 0 ? (
    <div className="grid grid-cols-1 w-full p-4 border border-ft-gray rounded-lg mb-6">
      <h2 className="text-4xl text-center text-ft-gray font-semibold mb-4">
        Resumo semanal
      </h2>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 w-full py-4 text-ft-primary">
        <Chart
          options={options}
          series={options.series}
          width="100%"
          type="bar"
          className="w-full"
        />
        <Chart
          options={options}
          series={options.series}
          width="100%"
          type="line"
        />
      </div>
    </div>
  ) : null;
}
