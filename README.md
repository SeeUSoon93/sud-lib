<p align="center">
  <a href="https://sud.co.kr" target="_blank">
    <img src="https://www.sud.co.kr/sud-logo.svg" alt="Sud UI 로고" width="400"/>
  </a>
</p>

# Soon UI Design Library [![npm version](https://img.shields.io/badge/npm-0.5.6-blue)](https://www.npmjs.com/package/sud-ui)

**Soon UI Design (SUD)** is a React UI library that helps you quickly build responsive and polished interfaces using reusable components and customizable design tokens.

<p align="center">
  <img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2FY76K2%2FbtsOQoqAXPl%2FAAAAAAAAAAAAAAAAAAAAAJx-tJsO5qplVMQjcswjVmtB2iQvTNqc_dmN8IRWFrDR%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1751295599%26allow_ip%3D%26allow_referer%3D%26signature%3DFqUntFzjghIepJz7UUHV7M7NpD8%253D" alt="Sud UI Components Preview"/>
</p>

---

## ✨ Features

- 🎨 Consistent design system with Tailwind-like syntax
- 🧩 50+ reusable components (Button, Modal, Table, etc.)
- 🌗 Light/Dark theme support
- ⚙️ Fully customizable theme and styles
- 🌀 Utility-first class support (e.g., `pd-10`, `mg-4`)

## 📦 Installation

```bash
npm install sud-ui
```

## 🧪 Examples Built with Soon UI

Check out real projects built using the SUD component library:

- [🗂️ CBT Exam App](https://cbt-app-self.vercel.app/)
- [📍 Korea Map Vector Tool](https://map-vector.vercel.app/)
- [🎣 어기어때 - Fishing Spot Search](https://fishing-search.vercel.app/)
- [📝 Soonlog - Personal Blog](https://soonlog.site/)

👉 These showcase the flexibility and visual consistency of SUD components in actual products.

## 🚀 Quick Start

```jsx
import React from "react";
import { Card, Typography, Avatar, Tag } from "sud-ui";
import { LogoGithub } from "sud-icons";

export default function App() {
  return (
    <Card
      colorType="gold"
      borderType="dashed"
      borderWeight={2}
      borderColor="red"
      style={{
        width: "100%"
      }}
    >
      <div className="flex gap-10">
        <Avatar colorType="orange" size="lg" />
        <div className="flex flex-col gap-5">
          <Typography suite="EB" size="2xl">
            SeeUSoon
          </Typography>
          <Typography color="black-10">
            Hello I'm SeeUSoon.
            <br />
            I'm Web Developer.
          </Typography>

          <Tag>
            <a
              href="https://github.com/SeeUSoon93"
              target="_blank"
              className="flex flex-row gap-5 item-cen"
            >
              <LogoGithub size="14" />
              <Typography suite="EB">github.com/SeeUSoon93</Typography>
            </a>
          </Tag>
        </div>
      </div>
    </Card>
  );
}
```

## 🧩 Components

Sud UI provides a comprehensive suite of ready-to-use components:

- **Button** – Styles, states, sizes
- **Modal** – Alert, confirm, custom modal
- **Accordion**, **Tabs**, **Tooltip**
- **Table** – Sort, filter, pagination
- **Input**, **Select** – Single/multi, number, password
- **Toast**, **Notification**, **Spinner**
- ...and **45+ more components**

📘 [See full list and API →](https://www.sud.co.kr/component/component-overview)

## 🎨 Theme & Customization

SUD provides full theming support via `SoonUIDesign`.

```jsx
import { SoonUIDesign, defaultTheme, darkTheme } from "sud-ui";

const customTheme = {
  ...defaultTheme,
  colors: {
    ocean: {
      1: "#e6f7ff",
      2: "#b3e5ff",
      3: "#80d3ff",
      4: "#4dc2ff",
      5: "#1ab0ff",
      6: "#0096e6",
      7: "#007abf",
      8: "#005f99",
      9: "#004473",
      10: "#00294d"
    }
  },
  components: {
    button: {
      primary: {
        bg: "ocean-6",
        txt: "white-10",
        border: "ocean-7"
      }
    }
  }
};

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <SoonUIDesign
      theme={customTheme}
      darkTheme={darkTheme}
      isDarkMode={isDarkMode}
    >
      <Button onClick={() => setIsDarkMode(!isDarkMode)}>
        Toggle Dark Mode
      </Button>
    </SoonUIDesign>
  );
}
```

## 📚 Documentation

- 🧾 [Get Started](https://sud.co.kr/start/start)
- 🧩 [Components](https://sud.co.kr/component/component-overview)

## 📄 License

MIT License ©SeeUSoon93
