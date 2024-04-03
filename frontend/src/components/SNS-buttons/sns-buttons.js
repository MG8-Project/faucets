import React from "react";
import Discord from "@/assets/SNS-icon/Discord";
import Gitbook from "@/assets/SNS-icon/Gitbook";
import Insta from "@/assets/SNS-icon/Insta";
import Medium from "@/assets/SNS-icon/Medium";
import Telegram from "@/assets/SNS-icon/Telegram";
import Twitter from "@/assets/SNS-icon/Twitter";
import Youtube from "@/assets/SNS-icon/Youtube";
import styles from "@/components/SNS-buttons/sns-buttons.module.css";

function SnsButtons() {
  return (
    <div className={styles.box}>
      <button>
        <a
          target="_blank"
          rel="noreferrer"
          href="https://discord.com/invite/artdefinance"
        >
          <Discord />
        </a>
      </button>
      <button>
        <a
          target="_blank"
          rel="noreferrer"
          href="https://twitter.com/ArtdeFinance"
        >
          <Twitter />
        </a>
      </button>
      <button>
        <a
          target="_blank"
          rel="noreferrer"
          href="https://www.instagram.com/art_de_finance/"
        >
          <Insta />
        </a>
      </button>
      <button>
        <a
          target="_blank"
          rel="noreferrer"
          href="https://medium.com/@Art_de_Finance"
        >
          <Medium />
        </a>
      </button>
      <button>
        <a target="_blank" rel="noreferrer" href="https://t.me/artdefinanceann">
          <Telegram />
        </a>
      </button>
      <button>
        <a
          target="_blank"
          rel="noreferrer"
          href="https://www.youtube.com/@artdefinance"
        >
          <Youtube />
        </a>
      </button>
      <button>
        <a
          target="_blank"
          rel="noreferrer"
          href="https://docs.artdefinance.io/"
        >
          <Gitbook />
        </a>
      </button>
    </div>
  );
}

export default SnsButtons;
