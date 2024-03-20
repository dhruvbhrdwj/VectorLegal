import Image from "next/image";

export default function Header() {
  return (
    <div className="flex flex-col items-start">
      <h1 style={{ fontSize: "28px", fontWeight: "bold", textAlign: "left" }}>ArbitrationGPT</h1>
      <p style={{ textAlign: "left" }}>Upload your documents, Create your Assistant, Build your strategy!</p>
    </div>
  );
}