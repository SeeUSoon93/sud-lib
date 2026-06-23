import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Accordion,
  Avatar,
  Badge,
  Breadcrumb,
  Button,
  Calendar,
  Card,
  Carousel,
  Checkbox,
  Collapse,
  ColorPicker,
  DatePicker,
  Divider,
  Div,
  DotSpinner,
  Drawer,
  Dropdown,
  Empty,
  FloatButton,
  Footer,
  Header,
  Image,
  Input,
  Layout,
  List,
  Menu,
  Modal,
  notification,
  OTP,
  Pagination,
  PopConfirm,
  Popover,
  Progress,
  Radio,
  Rate,
  Segmented,
  Select,
  Sider,
  Slider,
  SoonUIDesign,
  Spinner,
  Switch,
  Table,
  Tabs,
  Tag,
  Textarea,
  TimePicker,
  Timeline,
  toast,
  Tooltip,
  Typography,
  Upload,
  Content
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

function Section({ id, title, description, children }) {
  return (
    <section id={id} className="demo-panel rounded-xl p-5">
      <div className="mb-5 flex flex-col gap-1">
        <Typography as="h2" pretendard="SB" size="xl">
          {title}
        </Typography>
        <Typography color="cool-gray-6">{description}</Typography>
      </div>
      {children}
    </section>
  );
}

function App() {
  const [darkMode, setDarkMode] = useState(false);
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

  return (
    <SoonUIDesign isDarkMode={darkMode}>
      <main className="demo-shell min-h-screen px-4 py-6 text-slate-900 md:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-5">
          <header className="demo-panel sticky top-4 z-20 flex flex-col gap-4 rounded-xl p-4 md:flex-row md:items-center md:justify-between">
            <div>
              <Typography as="h1" gmarket="Bold" size="2xl">
                SUD UI Component Lab
              </Typography>
              <Typography color="cool-gray-6">
                npm 배포 전에 모든 주요 컴포넌트를 한 화면에서 직접 만져보는 테스트 페이지
              </Typography>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button colorType="primary" onClick={() => setModalOpen(true)}>
                Modal
              </Button>
              <Button colorType="sub" onClick={() => setDrawerOpen(true)}>
                Drawer
              </Button>
              <Switch
                checked={darkMode}
                onChange={setDarkMode}
                onText="Dark"
                offText="Light"
              />
            </div>
          </header>

          <nav className="demo-panel rounded-xl p-4">
            <div className="flex flex-wrap gap-3">
              {["general", "entry", "display", "feedback", "layout"].map((id) => (
                <a key={id} className="text-sm font-semibold text-sky-700" href={`#${id}`}>
                  {id}
                </a>
              ))}
            </div>
          </nav>

          <Section
            id="general"
            title="General"
            description="Typography, Button, Badge, Avatar, Tooltip, Popover, Dropdown, PopConfirm"
          >
            <div className="demo-grid">
              <Card title="Typography & Button" style={{ width: "100%" }}>
                <div className="flex flex-col gap-3">
                  <Typography gmarket="Bold" size="xl">
                    Gmarket heading
                  </Typography>
                  <Typography suite="EB" size="lg">
                    SUITE display text
                  </Typography>
                  <Typography code size="sm">
                    IntelOneMono-Medium webfont sample
                  </Typography>
                  <div className="flex flex-wrap gap-2">
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
                    <Tag colorType="rose" closeable>
                      closeable
                    </Tag>
                    <Badge count={7}>
                      <Button colorType="sub">Inbox</Button>
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4">
                    <Avatar sample={1} size="sm" />
                    <Avatar colorType="purple" size="sm">
                      S
                    </Avatar>
                    <Avatar.Group
                      max={3}
                      avatars={[{ sample: 1 }, { sample: 2 }, { sample: 3 }, { sample: 4 }]}
                    />
                  </div>
                </div>
              </Card>

              <Card title="Popup family" style={{ width: "100%" }}>
                <div className="flex flex-wrap items-center gap-3">
                  <Tooltip content="Tooltip content">
                    <Button colorType="sub">Hover tooltip</Button>
                  </Tooltip>
                  <Popover title="Popover" content="Reusable popup body">
                    <Button colorType="sub">Popover</Button>
                  </Popover>
                  <Dropdown items={menuItems} popupPlacement="bottom-left">
                    <Button colorType="sub">Dropdown</Button>
                  </Dropdown>
                  <PopConfirm
                    title="Run action?"
                    content="This is a confirmation popup."
                    trigger="click"
                    onConfirm={() => toast.success("Confirmed")}
                  >
                    <Button colorType="danger">PopConfirm</Button>
                  </PopConfirm>
                </div>
              </Card>
            </div>
          </Section>

          <Section
            id="entry"
            title="Data Entry"
            description="Input, Select, Checkbox, Radio, DatePicker, TimePicker, ColorPicker, Slider, Switch, Rate, Upload"
          >
            <div className="demo-grid">
              <Card title="Text controls" style={{ width: "100%" }}>
                <div className="flex flex-col gap-3">
                  <Input
                    label="Input"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    clearable
                  />
                  <Textarea
                    label="Textarea"
                    value={textareaValue}
                    onChange={(e) => setTextareaValue(e.target.value)}
                    autoSize
                    maxLength={120}
                  />
                  <OTP length={4} value={otp} onChange={(e) => setOtp(e.target.value)} />
                </div>
              </Card>

              <Card title="Choice controls" style={{ width: "100%" }}>
                <div className="flex flex-col gap-4">
                  <Checkbox.Group
                    options={[
                      { label: "API", value: "api" },
                      { label: "Accessibility", value: "a11y" },
                      { label: "Bundle", value: "bundle" }
                    ]}
                    value={checked}
                    onChange={setChecked}
                    direction="horizontal"
                  />
                  <Radio.Group
                    options={[
                      { label: "React", value: "react" },
                      { label: "Vite", value: "vite" },
                      { label: "Next", value: "next" }
                    ]}
                    value={radio}
                    onChange={setRadio}
                    direction="horizontal"
                  />
                  <Segmented
                    value={segment}
                    onChange={setSegment}
                    options={[
                      { label: "Daily", value: "daily" },
                      { label: "Weekly", value: "weekly" },
                      { label: "Monthly", value: "monthly" }
                    ]}
                  />
                </div>
              </Card>

              <Card title="Pickers" style={{ width: "100%" }}>
                <div className="flex flex-col gap-3">
                  <Select value={singleSelect} onChange={setSingleSelect} options={fruits} searchable />
                  <Select
                    multiMode
                    clearable
                    showSelectedCount
                    value={multiSelect}
                    onChange={setMultiSelect}
                    options={fruits}
                  />
                  <DatePicker locale="ko" onChange={(_, text) => setDateText(text)} placeholder="날짜 선택" />
                  <TimePicker onChange={(_, text) => setTimeText(text)} placeholder="시간 선택" showSecond />
                  <Typography size="sm" color="cool-gray-6">
                    {dateText || "date empty"} / {timeText || "time empty"}
                  </Typography>
                </div>
              </Card>

              <Card title="Color, rating, file" style={{ width: "100%" }}>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <ColorPicker
                      color={pickedColor}
                      onChange={(next) => setPickedColor(next.hex)}
                      mode="preset"
                    />
                    <Div
                      background={pickedColor}
                      style={{ width: 64, height: 36, borderRadius: 8 }}
                    />
                    <Typography code>{pickedColor}</Typography>
                  </div>
                  <Slider value={slider} onChange={setSlider} minMaxVisible unit="%" />
                  <Rate allowHalf value={rate} onChange={setRate} showValue />
                  <Switch checked={switchOn} onChange={setSwitchOn} onText="ON" offText="OFF" />
                  <Upload ext={["png", "jpg", "jpeg"]} multiple maxCount={3}>
                    <Button colorType="sub">Upload image</Button>
                  </Upload>
                </div>
              </Card>
            </div>
          </Section>

          <Section
            id="display"
            title="Data Display"
            description="Card, Image, Carousel, Collapse, Accordion, Tabs, Table, List, Timeline, Calendar, Empty, Progress, Spinner"
          >
            <div className="demo-grid">
              <Card title="Image & Carousel" style={{ width: "100%" }}>
                <div className="flex flex-col gap-4">
                  <Image
                    src="/assets/woman_01.png"
                    alt="sample asset"
                    width="100%"
                    height={180}
                    objectFit="contain"
                    preview
                  />
                  <Carousel
                    height={150}
                    effectType="slide"
                    navBtn
                    items={[
                      <Card key="a" colorType="sky" style={{ width: "100%", height: "100%" }}>
                        Slide A
                      </Card>,
                      <Card key="b" colorType="apricot" style={{ width: "100%", height: "100%" }}>
                        Slide B
                      </Card>,
                      <Card key="c" colorType="green" style={{ width: "100%", height: "100%" }}>
                        Slide C
                      </Card>
                    ]}
                  />
                </div>
              </Card>

              <Card title="Accordion & Collapse" style={{ width: "100%" }}>
                <div className="flex flex-col gap-4">
                  <Accordion
                    items={menuItems}
                    selectedKey={selectedMenu}
                    onSelect={setSelectedMenu}
                    divider
                  />
                  <Collapse
                    defaultOpenKeys={["one"]}
                    items={[
                      { key: "one", label: "First panel", children: "Collapse body one" },
                      { key: "two", label: "Second panel", children: "Collapse body two" }
                    ]}
                  />
                </div>
              </Card>

              <Card title="Tabs, List, Empty" style={{ width: "100%" }}>
                <Tabs
                  value={tab}
                  onChange={setTab}
                  options={[
                    { key: "display", label: "Display", children: <List dataSource={listItems} /> },
                    { key: "empty", label: "Empty", children: <Empty description="No component selected" /> }
                  ]}
                />
              </Card>

              <Card title="Table & Progress" style={{ width: "100%" }}>
                <div className="flex flex-col gap-4">
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

              <Card title="Timeline & Calendar" style={{ width: "100%" }}>
                <div className="flex flex-col gap-4">
                  <Timeline
                    mode="alternate"
                    items={[
                      { key: 1, label: "Today", content: "CSS migration" },
                      { key: 2, label: "Next", content: "Visual QA" },
                      { key: 3, label: "Ship", content: "npm publish dry-run" }
                    ]}
                  />
                  <Calendar
                    locale="ko"
                    value={new Date("2026-06-23")}
                    items={calendarItems}
                    viewControl
                    dateControl
                    style={{ minHeight: 420 }}
                  />
                </div>
              </Card>
            </div>
          </Section>

          <Section
            id="feedback"
            title="Feedback & Overlay"
            description="Modal, Drawer, Toast, Notification, FloatButton"
          >
            <div className="demo-mini-grid">
              <Button
                colorType="success"
                onClick={() => toast.success("Toast success message")}
              >
                Show toast
              </Button>
              <Button
                colorType="warning"
                onClick={() =>
                  notification.open({
                    title: "Notification",
                    message: "배포 전 확인용 알림입니다.",
                    position: "top-right"
                  })
                }
              >
                Show notification
              </Button>
              <Button colorType="primary" onClick={() => setModalOpen(true)}>
                Open modal
              </Button>
              <Button colorType="sub" onClick={() => setDrawerOpen(true)}>
                Open drawer
              </Button>
            </div>
          </Section>

          <Section
            id="layout"
            title="Layout & Navigation"
            description="Layout, Header, Sider, Content, Footer, Breadcrumb, Menu, Pagination, Divider"
          >
            <div className="demo-grid">
              <Card title="Navigation" style={{ width: "100%" }}>
                <div className="flex flex-col gap-4">
                  <Breadcrumb
                    items={[
                      { label: "Home", href: "#" },
                      { label: "Library", href: "#" },
                      { label: "Component Lab" }
                    ]}
                  />
                  <Menu
                    items={menuItems}
                    selectedKey={selectedMenu}
                    onSelect={setSelectedMenu}
                    horizontal
                    expandType="popover"
                  />
                  <Divider />
                  <Pagination
                    total={48}
                    pageSize={8}
                    defaultCurrent={page}
                    onChange={setPage}
                    showFirstLast
                    align="center"
                  />
                </div>
              </Card>

              <Card title="Layout shell" style={{ width: "100%" }}>
                <div style={{ height: 320 }}>
                  <Layout>
                    <Header height={56} colorType="primary">
                      <Typography color="white-10" pretendard="SB">
                        Header
                      </Typography>
                    </Header>
                    <Sider width={120} colorType="sub">
                      <Menu items={menuItems} selectedKey={selectedMenu} onSelect={setSelectedMenu} />
                    </Sider>
                    <Content>
                      <div className="p-4">
                        <Typography as="h3" pretendard="SB">
                          Content
                        </Typography>
                        <Typography color="cool-gray-6">
                          Header/Sider/Footer offset을 실제 레이아웃에서 확인합니다.
                        </Typography>
                      </div>
                    </Content>
                    <Footer height={48} colorType="default">
                      <Typography size="sm">Footer</Typography>
                    </Footer>
                  </Layout>
                </div>
              </Card>
            </div>
          </Section>
        </div>

        <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Modal preview">
          <Typography>
            모달 컴포넌트의 overlay, title, body, close 동작을 확인합니다.
          </Typography>
        </Modal>

        <Drawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          title="Drawer preview"
          placement="right"
          width={360}
          divider
        >
          <List dataSource={listItems} />
        </Drawer>

        <FloatButton
          isExample
          placement="bottom-right"
          icon="+"
          colorType="primary"
          actions={[
            { icon: "T", onClick: () => toast.info("Toast action") },
            { icon: "N", onClick: () => setDrawerOpen(true) }
          ]}
        />
      </main>
    </SoonUIDesign>
  );
}

createRoot(document.getElementById("root")).render(<App />);
