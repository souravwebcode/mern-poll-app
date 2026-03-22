import { useEffect, useState } from "react";
import { getPolls } from "../services/api";
import PollItem from "./PollItem";
import Filter from "./Filter";

export default function PollList() {
  const [polls, setPolls] = useState([]);
  const [filter, setFilter] = useState("");

  const fetchPolls = async () => {
    const { data } = await getPolls(filter);
    setPolls(data);
  };

  useEffect(() => {
    fetchPolls();
  }, [filter]);

  return (
    <div>
      <Filter setFilter={setFilter} />
      {polls.map((p) => (
        <PollItem key={p._id} poll={p} refresh={fetchPolls} />
      ))}
    </div>
  );
}