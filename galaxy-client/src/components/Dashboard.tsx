import { GET_QUERY } from "@/api/query";
import { chainStateAtom } from "@/state/atom";
import { useQuery } from "@apollo/client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { CategoryButton } from "./common/Button";

interface Collection {
  id: string;
  name: string;
  totalVolume: number;
  floorPrice: string;
  profileImage: string;
  createdAt: string;
  category: string;
}

interface Nft {
  id: string;
  name: string;
  image: string;
}

export const categoryButtonArray = [
  { name: "all" },
  { name: "pfp" },
  { name: "art" },
  { name: "gaming" },
];

export const multiChainArray = [
  { name: "ETH", src: "/logo/ethereum.png" },
  { name: "SOL", src: "/logo/solana.png" },
  { name: "APTOS", src: "/logo/aptos.png" },
];

const Dashboard = () => {
  const [chain, setChain] = useRecoilState(chainStateAtom);
  const [collectionId, setCollectionId] = useState("ETH");
  const [category, setCategory] = useState("all");
  const { data, loading, error } = useQuery(GET_QUERY, {
    variables: {
      collectionId: `${collectionId}`,
      chain: chain,
    },
  });

  useEffect(() => {
    setCollectionId(
      chain === "ETH"
        ? "3"
        : chain === "SOL"
        ? "11"
        : chain === "APTOS"
        ? "15"
        : "3"
    );
  }, [chain]);

  let dataCategory = [];
  switch (category) {
    case "all":
      dataCategory = data?.allCollections;
      break;
    case "pfp":
      dataCategory = data?.pfpCollection;
      break;
    case "art":
      dataCategory = data?.artCollection;
      break;
    case "gaming":
      dataCategory = data?.gamingCollection;
      break;
    default:
      dataCategory = data?.allCollections;
      break;
  }

  if (loading) return <h1>Loading...</h1>;
  if (error) return <h1>Not fetching :(</h1>;

  return (
    <section className="py-[0.1rem] mx-auto">
      <div
        className={`pt-8 pb-8 shadow ${
          chain === "ETH"
            ? "bg-blue-1000"
            : chain === "SOL"
            ? "bg-purple-1000"
            : chain === "APTOS"
            ? "bg-gray-900"
            : "bg-blue-1000"
        }`}
      >
        <div className="px-8 border-b">
          <div className="flex flex-wrap items-center mb-3">
            <h3 className="text-2xl font-bold text-white">🔥Trending NFTs🔥</h3>
          </div>
          <div className="flex justify-between pb-8 px-4">
            {data.nftsByCollection.map((nft: Nft) => (
              <div key={`${nft.id}/${nft.name}`} className="relative">
                <Image
                  width={280}
                  height={280}
                  src={nft.image}
                  alt="nftsByCollection"
                  className="rounded-3xl shadow-md w-full"
                />
                <div className="absolute bg-black w-full h-10 bottom-0 left-0 opacity-60 rounded-b-3xl"></div>
                <p className="font-semibold text-sm text-white absolute bottom-[0.62rem] left-3">
                  {nft.name}
                </p>
              </div>
            ))}
          </div>
          <div className="flex justify-between">
            <div className="flex">
              {categoryButtonArray.map((parameter) => (
                <CategoryButton
                  key={parameter.name}
                  isActive={category === parameter.name}
                  onClick={() => {
                    setCategory(parameter.name);
                  }}
                >
                  {parameter.name.toUpperCase()}
                </CategoryButton>
              ))}
            </div>
            <div className="flex">
              {multiChainArray.map((parameter) => (
                <button
                  key={parameter.name}
                  onClick={() => setChain(parameter.name)}
                  className={`flex px-4 pb-2 text-sm text-white font-bold
                  ${chain === parameter.name ? "border-b-2" : ""}`}
                >
                  <Image
                    width={30}
                    height={30}
                    src={parameter.src}
                    alt="multiChain"
                    className="rounded-full mr-2"
                  />
                  <p className="m-auto text-base">{parameter.name}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="table-auto w-full">
            <thead>
              <tr className="text-xs text-gray-500">
                <th className="flex items-center pl-8 pt-8 font-medium">
                  <span>COLLECTION</span>
                </th>
                <th className="pt-8 font-medium text-right pr-10">
                  FLOOR PRICE
                </th>
                <th className="pt-8 font-medium text-right pr-10">VOLUME</th>
                <th className="pt-8 font-medium text-right pr-10">CATEOGRY</th>
                <th className="pt-8 font-medium text-right pr-10">
                  CREATED AT
                </th>
              </tr>
            </thead>
            <tbody>
              {dataCategory.map((collection: Collection, index: number) => (
                <tr key={`${collection.id}/${collection.name}`}>
                  <td className="flex items-center my-3 px-8 font-medium">
                    <p className="mr-7 text-white text-lg">{index + 1}.</p>
                    <button onClick={() => setCollectionId(collection.id)}>
                      <Image
                        width={60}
                        height={60}
                        src={collection.profileImage}
                        alt="collectionProfileImage"
                        className="rounded-xl shadow-md mr-3"
                      />
                    </button>
                    <p className="text-white text-sm">{collection.name}</p>
                  </td>
                  <td className="text-white text-sm text-right pr-10">
                    {collection.floorPrice} {chain}
                  </td>
                  <td className="text-white text-sm text-right pr-10">
                    {collection.totalVolume} {chain}
                  </td>
                  <td className="text-white text-sm text-right pr-10">
                    {collection.category.toUpperCase()}
                  </td>
                  <td className="text-white text-sm text-right pr-10">
                    {collection.createdAt}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
