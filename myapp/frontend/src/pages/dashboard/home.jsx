import React, { useEffect, useState } from "react";
import { Typography } from "@material-tailwind/react";
import { StatisticsCard } from "@/widgets/cards";
import axios from "axios";

// Use your existing icons from statisticsCardsData
import { statisticsCardsData as initialCardsData } from "@/data";

export function Home() {
  const [stats, setStats] = useState({
    total_users: 0,
    total_books: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("http://localhost:3000/stats"); // your API endpoint
        setStats(res.data);
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };
    fetchStats();
  }, []);

  // Merge dynamic counts into the existing statisticsCardsData
  const statisticsCardsData = initialCardsData.map((card) => {
    if (card.title === "Total Users") {
      return { ...card, value: stats.total_users, footer: null };
    }
    if (card.title === "Total Books") {
      return { ...card, value: stats.total_books, footer: null };
    }
    return card;
  });

  return (
    <div className="mt-12">
      <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
        {statisticsCardsData.map(({ icon, title, value, footer, ...rest }) => (
          <StatisticsCard
            key={title}
            {...rest}
            title={title}
            value={value}
            icon={React.createElement(icon, { className: "w-6 h-6 text-white" })}
            footer={footer} 
          />
        ))}
      </div>
    </div>
  );
}

export default Home;
