import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Accordion, Avatar, Badge, Breadcrumb, Button, Calendar, Card, Carousel,
  Checkbox, Collapse, ColorPicker, DatePicker, Divider, Div, DotSpinner,
  Drawer, Dropdown, Empty, FloatButton, Footer, Header, Image, Input, Layout,
  List, Menu, Modal, notification, OTP, Pagination, PopConfirm, Popover,
  Progress, Radio, Rate, Segmented, Select, Sider, Slider, SoonUIDesign,
  Spinner, Switch, Table, Tabs, Tag, Textarea, TimePicker, Timeline, toast,
  Tooltip, Typography, Upload, Content
} from "../src/index.js";
import "./demo.css";

const fruits = [
  { label: "Apple", value: "apple" },
  { label: "Orange", value: "orange" },
  { label: "Grape", value: "grape" },
  { label: "Melon", value: "melon" }
];

const menuItems = [
  {
    key: "overview",
    label: "Overview",
    children: [
      { key: "tokens", label: "Tokens" },
      { key: "usage", label: "Usage" }
    ]
  },
  {
    key: "components",
    label: "Components",
    children: [
      { key: "inputs", label: "Inputs" },
      { key: "overlays", label: "Overlays" }
    ]
  }
];

const tableRows = [
  { key: "1", component: "Button", status: "Stable", score: 96 },
  { key: "2", component: "Select", status: "Check keyboard", score: 88 },
  { key: "3", component: "Modal", status: "Needs focus trap", score: 72 },
  { key: "4", component: "Table", status: "Stable", score: 91 }
];

const tableColumns = [
  { key: "component", dataIndex: "component", title: "Component", sorter: true },
  { key: "status", dataIndex: "status", title: "Status" },
  {
    key: "score",
    dataIndex: "score",
    title: "Score",
    sorter: true,
    render: (value) => <Tag colorType={value > 90 ? "green" : "orange"}>{value}</Tag>
  }
];

const calendarItems = [
  { key: "design", date: "2026-06-23", content: "SUD lab" },
  { key: "release", date: "2026-06-27", content: "npm dry run", colorType: "sky" }
];

const navMenuItems = [
  { key: "general", label: "General" },
  { key: "entry", label: "Data Entry" },
  { key: "display", label: "Data Display" },
  { key: "feedback", label: "Feedback & Overlay" },
  { key: "layout", label: "Layout & Nav" },
];

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [activeMenu, setActiveMenu] = useState("general");
  
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [inputValue, setInputValue] = useState("Soon UI");
  const [textareaValue, setTextareaValue] = useState("컴포넌트 설명을 직접 입력해보세요.");
  const [otp, setOtp] = useState("1234");
  const [singleSelect, setSingleSelect] = useState("apple");
  const [multiSelect, setMultiSelect] = useState(["apple", "grape"]);
  const [checked, setChecked] = useState(["api", "a11y"]);
  const [radio, setRadio] = useState("react");
  const [rate, setRate] = useState(3.5);
  const [slider, setSlider] = useState(64);
  const [switchOn, setSwitchOn] = useState(true);
  const [segment, setSegment] = useState("daily");
  const [tab, setTab] = useState("display");
  const [page, setPage] = useState(1);
  const [pickedColor, setPickedColor] = useState("#2f80ed");
  const [dateText, setDateText] = useState("");
  const [timeText, setTimeText] = useState("");
  const [selectedMenu, setSelectedMenu] = useState("overview");

  const listItems = useMemo(
    () => [
      <div className="flex items-center justify-between">
        <span>Build CSS with Tailwind</span>
        <Tag colorType="green">done</Tag>
      </div>,
      <div className="flex items-center justify-between">
        <span>Remove packaged fonts</span>
        <Tag colorType="green">done</Tag>
      </div>,
      <div className="flex items-center justify-between">
        <span>Run visual component lab</span>
        <Tag colorType="sky">live</Tag>
      </div>
    ],
    []
  );

  const renderGeneral = () => (
    <div className="demo-grid">
      <Card title="Typography & Button" style={{ width: "100%" }}>
        <div className="flex flex-col gap-3">
          <Typography gmarket="Bold" size="xl">Gmarket heading</Typography>
          <Typography suite="EB" size="lg">SUITE display text</Typography>
          <Typography code size="sm">IntelOneMono-Medium webfont sample</Typography>
          <div className="flex flex-wrap gap-2 mt-4">
            <Button colorType="primary">Primary</Button>
            <Button colorType="success">Success</Button>
            <Button colorType="warning">Warning</Button>
            <Button colorType="danger" loading loadingText="Saving" />
          </div>
        </div>
      </Card>
      <Card title="Tags, Badges, Avatars" style={{ width: "100%" }}>
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            <Tag colorType="sky">sky</Tag>
            <Tag colorType="gold">gold</Tag>
            <Tag colorType="rose" closeable>closeable</Tag>
            <Badge count={7}><Button colorType="sub">Inbox</Button></Badge>
          </div>
          <Divider />
          <div className="flex items-center gap-4">
            <Avatar sample={1} size="sm" />
            <Avatar colorType="purple" size="sm">S</Avatar>
            <Avatar.Group max={3} avatars={[{ sample: 1 }, { sample: 2 }, { sample: 3 }, { sample: 4 }]} />
          </div>
        </div>
      </Card>
      <Card title="Popup family" style={{ width: "100%" }}>
        <div className="flex flex-col gap-4">
          <Tooltip content="Tooltip content"><Button colorType="sub">Hover tooltip</Button></Tooltip>
          <Popover title="Popover" content="Reusable popup body"><Button colorType="sub">Popover</Button></Popover>
          <Dropdown items={menuItems} popupPlacement="bottom-left"><Button colorType="sub">Dropdown</Button></Dropdown>
          <PopConfirm title="Run action?" content="This is a confirmation popup." trigger="click" onConfirm={() => toast.success("Confirmed")}>
            <Button colorType="danger">PopConfirm</Button>
          </PopConfirm>
        </div>
      </Card>
    </div>
  );

  const renderDataEntry = () => (
    <div className="demo-grid">
      <Card title="Text controls" style={{ width: "100%" }}>
        <div className="flex flex-col gap-4">
          <Input label="Input" value={inputValue} onChange={(e) => setInputValue(e.target.value)} clearable />
          <Textarea label="Textarea" value={textareaValue} onChange={(e) => setTextareaValue(e.target.value)} autoSize maxLength={120} />
          <OTP length={4} value={otp} onChange={(e) => setOtp(e.target.value)} />
        </div>
      </Card>
      <Card title="Choice controls" style={{ width: "100%" }}>
        <div className="flex flex-col gap-6">
          <Checkbox.Group
            options={[{ label: "API", value: "api" }, { label: "Accessibility", value: "a11y" }, { label: "Bundle", value: "bundle" }]}
            value={checked} onChange={setChecked} direction="horizontal" />
          <Radio.Group
            options={[{ label: "React", value: "react" }, { label: "Vite", value: "vite" }, { label: "Next", value: "next" }]}
            value={radio} onChange={setRadio} direction="horizontal" />
          <Segmented
            value={segment} onChange={setSegment}
            options={[{ label: "Daily", value: "daily" }, { label: "Weekly", value: "weekly" }, { label: "Monthly", value: "monthly" }]} />
        </div>
      </Card>
      <Card title="Pickers" style={{ width: "100%" }}>
        <div className="flex flex-col gap-4">
          <Select value={singleSelect} onChange={setSingleSelect} options={fruits} searchable />
          <Select multiMode clearable showSelectedCount value={multiSelect} onChange={setMultiSelect} options={fruits} />
          <DatePicker locale="ko" onChange={(_, text) => setDateText(text)} placeholder="날짜 선택" />
          <TimePicker onChange={(_, text) => setTimeText(text)} placeholder="시간 선택" showSecond />
          <Typography size="sm" color="cool-gray-6">{dateText || "date empty"} / {timeText || "time empty"}</Typography>
        </div>
      </Card>
      <Card title="Color, rating, slider" style={{ width: "100%" }}>
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <ColorPicker color={pickedColor} onChange={(next) => setPickedColor(next.hex)} mode="preset" />
            <Div background={pickedColor} style={{ width: 64, height: 36, borderRadius: 8 }} />
            <Typography code>{pickedColor}</Typography>
          </div>
          <Slider value={slider} onChange={setSlider} minMaxVisible unit="%" />
          <Rate allowHalf value={rate} onChange={setRate} showValue />
          <Switch checked={switchOn} onChange={setSwitchOn} onText="ON" offText="OFF" />
        </div>
      </Card>
    </div>
  );

  const renderDataDisplay = () => (
    <div className="demo-grid">
      <Card title="Image & Carousel" style={{ width: "100%" }}>
        <div className="flex flex-col gap-4">
          <Image src="/assets/woman_01.png" alt="sample asset" width="100%" height={180} objectFit="contain" preview />
          <Carousel height={150} effectType="slide" navBtn items={[
            <Card key="a" colorType="sky" style={{ width: "100%", height: "100%" }}>Slide A</Card>,
            <Card key="b" colorType="apricot" style={{ width: "100%", height: "100%" }}>Slide B</Card>,
            <Card key="c" colorType="green" style={{ width: "100%", height: "100%" }}>Slide C</Card>
          ]} />
        </div>
      </Card>
      <Card title="Accordion & Collapse" style={{ width: "100%" }}>
        <div className="flex flex-col gap-4">
          <Accordion items={menuItems} selectedKey={selectedMenu} onSelect={setSelectedMenu} divider />
          <Collapse defaultOpenKeys={["one"]} items={[
            { key: "one", label: "First panel", children: "Collapse body one" },
            { key: "two", label: "Second panel", children: "Collapse body two" }
          ]} />
        </div>
      </Card>
      <Card title="Tabs & List" style={{ width: "100%" }}>
        <Tabs value={tab} onChange={setTab} options={[
          { key: "display", label: "Display", children: <List dataSource={listItems} /> },
          { key: "empty", label: "Empty", children: <Empty description="No component selected" /> }
        ]} />
      </Card>
      <Card title="Table & Progress" style={{ width: "100%" }}>
        <div className="flex flex-col gap-6">
          <Table columns={tableColumns} dataSource={tableRows} pagination={{ pageSize: 2 }} />
          <Progress value={slider} colorType="sky" showText />
          <div className="flex items-center gap-6">
            <Progress type="circle" value={72} colorType="green" />
            <Progress type="dashboard" value={48} colorType="orange" />
            <Spinner />
            <DotSpinner />
          </div>
        </div>
      </Card>
      <Card title="Calendar" style={{ width: "100%" }}>
        <Calendar locale="ko" value={new Date("2026-06-23")} items={calendarItems} viewControl dateControl style={{ minHeight: 380 }} />
      </Card>
    </div>
  );

  const renderFeedback = () => (
    <div className="demo-mini-grid">
      <Card style={{ width: "100%" }} className="items-center justify-center flex">
        <Button colorType="success" onClick={() => toast.success("Toast success message")}>Show toast</Button>
      </Card>
      <Card style={{ width: "100%" }} className="items-center justify-center flex">
        <Button colorType="warning" onClick={() => notification.open({ title: "Notification", message: "배포 전 확인용 알림입니다.", position: "top-right" })}>Show notification</Button>
      </Card>
      <Card style={{ width: "100%" }} className="items-center justify-center flex">
        <Button colorType="primary" onClick={() => setModalOpen(true)}>Open modal</Button>
      </Card>
      <Card style={{ width: "100%" }} className="items-center justify-center flex">
        <Button colorType="sub" onClick={() => setDrawerOpen(true)}>Open drawer</Button>
      </Card>
    </div>
  );

  const renderLayout = () => (
    <div className="demo-grid">
      <Card title="Navigation" style={{ width: "100%" }}>
        <div className="flex flex-col gap-6">
          <Breadcrumb items={[{ label: "Home", href: "#" }, { label: "Library", href: "#" }, { label: "Component Lab" }]} />
          <Menu items={menuItems} selectedKey={selectedMenu} onSelect={setSelectedMenu} horizontal expandType="popover" />
          <Divider />
          <Pagination total={48} pageSize={8} defaultCurrent={page} onChange={setPage} showFirstLast align="center" />
        </div>
      </Card>
      <Card title="Layout Shell" style={{ width: "100%" }}>
        <div style={{ height: 320 }}>
          <Layout>
            <Header height={56} colorType="primary">
              <Typography color="white-10" pretendard="SB">Header</Typography>
            </Header>
            <Sider width={120} colorType="sub">
              <Menu items={navMenuItems} selectedKey={activeMenu} onSelect={setActiveMenu} />
            </Sider>
            <Content>
              <div className="p-4 flex flex-col gap-2">
                <Typography as="h3" pretendard="SB">Content Area</Typography>
                <Typography color="cool-gray-6">Inner workspace</Typography>
              </div>
            </Content>
            <Footer height={48} colorType="default">
              <Typography size="sm">Footer</Typography>
            </Footer>
          </Layout>
        </div>
      </Card>
    </div>
  );

  const contentMap = {
    general: renderGeneral,
    entry: renderDataEntry,
    display: renderDataDisplay,
    feedback: renderFeedback,
    layout: renderLayout,
  };

  return (
    <SoonUIDesign isDarkMode={darkMode}>
      <div className="demo-shell flex min-h-screen">
        {/* Sidebar */}
        <aside className="demo-panel m-4 hidden w-64 flex-col rounded-2xl p-6 md:flex shrink-0 h-[calc(100vh-32px)] sticky top-4">
          <div className="mb-8">
            <Typography as="h1" gmarket="Bold" size="2xl" color={darkMode ? "white-10" : "slate-900"}>SUD Lab</Typography>
            <Typography color={darkMode ? "slate-400" : "slate-500"} size="sm" className="mt-1">UI Component Showcase</Typography>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2">
            <Menu items={navMenuItems} selectedKey={activeMenu} onSelect={setActiveMenu} />
          </div>
          
          <div className="mt-4 border-t border-slate-200 dark:border-slate-700 pt-6 flex justify-between items-center">
            <Typography pretendard="SB" color={darkMode ? "white-10" : "slate-900"}>Theme</Typography>
            <Switch checked={darkMode} onChange={setDarkMode} onText="Dark" offText="Light" />
          </div>
        </aside>

        {/* Mobile Nav (Top) */}
        <div className="md:hidden fixed top-0 w-full z-10 demo-panel rounded-none p-4 flex justify-between items-center border-t-0 border-l-0 border-r-0">
          <Typography as="h1" gmarket="Bold" size="xl">SUD Lab</Typography>
          <Switch checked={darkMode} onChange={setDarkMode} />
        </div>

        {/* Main Content Area */}
        <main className="flex-1 p-4 pt-20 md:pt-4 md:pl-0 w-full overflow-hidden">
          <div className="demo-panel rounded-2xl h-[calc(100vh-100px)] md:h-[calc(100vh-32px)] p-6 md:p-10 flex flex-col gap-8 overflow-y-auto">
            <header className="flex flex-col gap-2 border-b border-slate-200 dark:border-slate-700 pb-6 shrink-0">
               <Typography as="h2" gmarket="Bold" size="3xl" color={darkMode ? "white-10" : "slate-900"}>
                 {navMenuItems.find(m => m.key === activeMenu)?.label}
               </Typography>
               <Typography color={darkMode ? "slate-400" : "slate-500"}>
                 Explore the {navMenuItems.find(m => m.key === activeMenu)?.label.toLowerCase()} components of the SUD UI library.
               </Typography>
               <div className="md:hidden mt-4">
                 <Menu items={navMenuItems} selectedKey={activeMenu} onSelect={setActiveMenu} horizontal />
               </div>
            </header>
            
            <div className="flex-1 pb-20">
              {contentMap[activeMenu]()}
            </div>
          </div>
        </main>
      </div>

      {/* Global Overlays */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Modal preview">
        <Typography>모달 컴포넌트의 overlay, title, body, close 동작을 확인합니다.</Typography>
      </Modal>

      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title="Drawer preview" placement="right" width={360} divider>
        <List dataSource={listItems} />
      </Drawer>

      <FloatButton isExample placement="bottom-right" icon="+" colorType="primary" actions={[
        { icon: "T", onClick: () => toast.info("Toast action") },
        { icon: "N", onClick: () => setDrawerOpen(true) }
      ]} />
    </SoonUIDesign>
  );
}

createRoot(document.getElementById("root")).render(<App />);
