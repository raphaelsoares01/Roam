import Image from "next/image";

import "./LiquidAddButton.css";

type LiquidAddButtonProps = {
  className?: string;
  onClick?: () => void;
};

export default function LiquidAddButton({
  className,
  onClick,
}: LiquidAddButtonProps) {
  return (
    <button
      className={`liquid-add-button ${className ?? ""}`}
      type="button"
      aria-label="Iniciar novo plano de viagem"
      onClick={onClick}
    >
      <Image
        className="liquid-add-button__base"
        src="/figma/Add_and_right_text/Main.svg"
        alt=""
        width={1329}
        height={130}
        priority
      />

      <div className="liquid-add-button__mask" aria-hidden="true">
        <Image
          className="liquid-add-button__vector liquid-add-button__vector--one"
          src="/figma/Add_and_right_text/Vector 1.svg"
          alt=""
          width={2560}
          height={660}
          priority
        />
        <Image
          className="liquid-add-button__vector liquid-add-button__vector--two"
          src="/figma/Add_and_right_text/Vector 2.svg"
          alt=""
          width={2560}
          height={660}
          priority
        />
      </div>
    </button>
  );
}
