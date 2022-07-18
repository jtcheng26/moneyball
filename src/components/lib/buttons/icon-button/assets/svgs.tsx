import React from "react";
import { Svg, G, Path, Defs, ClipPath, Rect } from "react-native-svg";

// Each nameValuePair can be:
// * Name: <Svg />; or
// * Name: { svg: <Svg />, viewBox: '0 0 50 50' }

export default {
  Basketball: {
    svg: (
      <Path d="M2.34,14.63C2.94,14.41 3.56,14.3 4.22,14.3C5.56,14.3 6.73,14.72 7.73,15.56L4.59,18.7C3.53,17.5 2.78,16.13 2.34,14.63M15.56,9.8C17.53,11.27 19.66,11.63 21.94,10.88C21.97,11.09 22,11.47 22,12C22,13.03 21.75,14.18 21.28,15.45C20.81,16.71 20.23,17.73 19.55,18.5L13.22,12.19L15.56,9.8M8.77,16.64C9.83,18.17 10.05,19.84 9.42,21.66C8,21.25 6.73,20.61 5.67,19.73L8.77,16.64M12.19,13.22L18.5,19.55C16.33,21.45 13.78,22.25 10.88,21.94C11.09,21.28 11.2,20.56 11.2,19.78C11.2,19.16 11.06,18.43 10.78,17.6C10.5,16.77 10.17,16.09 9.8,15.56L12.19,13.22M8.81,14.5C7.88,13.67 6.8,13.15 5.58,12.91C4.36,12.68 3.19,12.75 2.06,13.13C2.03,12.91 2,12.53 2,12C2,10.97 2.25,9.82 2.72,8.55C3.19,7.29 3.77,6.27 4.45,5.5L11.11,12.19L8.81,14.5M15.56,7.73C14.22,6.08 13.91,4.28 14.63,2.34C15.25,2.5 15.96,2.8 16.76,3.26C17.55,3.71 18.2,4.16 18.7,4.59L15.56,7.73M21.66,9.38C21.06,9.59 20.44,9.7 19.78,9.7C18.69,9.7 17.64,9.38 16.64,8.72L19.73,5.67C20.61,6.77 21.25,8 21.66,9.38M12.19,11.11L5.5,4.45C7.67,2.55 10.22,1.75 13.13,2.06C12.91,2.72 12.8,3.44 12.8,4.22C12.8,4.94 12.96,5.75 13.29,6.66C13.62,7.56 14,8.28 14.5,8.81L12.19,11.11Z" />
    ),
    viewBox: "0 0 24 24",
  },
  BasketballHoop: {
    svg: (
      <Path d="M21,2H3A2,2 0 0,0 1,4V16A2,2 0 0,0 3,18H5V14H19V18H21A2,2 0 0,0 23,16V4A2,2 0 0,0 21,2M17,12H15V9H9V12H7V9A2,2 0 0,1 9,7H15A2,2 0 0,1 17,9V12M7,16V19.5L8,23L10,21L12,23L14,21L16,23L17,19.5V16H7Z" />
    ),
    viewBox: "0 0 24 24",
  },
  BallAndHoop: {
    svg: (
      <Path d="M21.5241 40.4667H8.37532C9.02162 32.5675 11.8415 24.7593 16.5227 18.364C19.3491 25.3362 21.0377 32.959 21.5241 40.4667ZM30.1957 40.4667H48.4667V0.133331C38.7048 0.989205 30.1124 5.07691 22.9357 11.7493C27.2103 20.6693 29.6777 30.589 30.1957 40.4667ZM56.5333 0.133331V40.4667H74.8043C75.3222 30.589 77.7898 20.6693 82.0643 11.7493C74.8874 5.07691 66.2951 0.989205 56.5333 0.133331ZM88.4773 18.364C85.6508 25.3362 83.9624 32.959 83.476 40.4667H96.6246C95.9785 32.5675 93.1584 24.7593 88.4773 18.364ZM104.933 52.5601C104.933 54.7841 103.13 56.5869 100.906 56.5869H86.5413L80.4107 68.8484V88.0471C80.3929 88.6537 80.2009 89.2426 79.8581 89.7435C79.5145 90.2436 79.0345 90.6349 78.4747 90.8704C78.106 90.9696 77.7269 91.0237 77.3453 91.0318C76.9517 91.0495 76.5588 90.9793 76.1958 90.8252C75.8328 90.672 75.5093 90.4397 75.248 90.1444L67.02 81.9971L54.194 90.5478C53.6856 90.864 53.0988 91.0318 52.5 91.0318C51.9012 91.0318 51.3144 90.864 50.806 90.5478L37.98 81.9971L29.752 90.1444C29.3451 90.5687 28.822 90.8648 28.2481 90.9938C27.6743 91.1229 27.075 91.0802 26.5253 90.8704C25.9657 90.6349 25.4855 90.2436 25.1422 89.7435C24.799 89.2426 24.607 88.6537 24.5893 88.0471V68.8484L18.4587 56.5869H4.09345C1.86955 56.5869 0.0666504 54.7841 0.0666504 52.5602C0.0666343 50.3362 1.86947 48.5333 4.09345 48.5333H100.906C103.13 48.5333 104.933 50.3362 104.933 52.5601ZM47.3373 56.5869H25.2346L30.3167 66.8318C30.5361 67.2262 30.6474 67.6715 30.6393 68.1224V80.7064L35.1567 76.2698L47.3373 56.5869ZM63.3093 77.1571L52.5 59.7329L41.6906 77.1571L52.5 84.4171L63.3093 77.1571ZM79.846 56.5869H57.6627L69.8433 76.2698L74.3606 80.7064V68.1224C74.3526 67.6715 74.4639 67.2262 74.6833 66.8318L79.846 56.5869Z" />
    ),
    viewBox: "0 0 105 92",
  },
  CameraFlip: {
    svg: (
      <Path d="M20 5H17L15 3H9L7 5H4C2.9 5 2 5.9 2 7V19C2 20.11 2.9 21 4 21H20C21.11 21 22 20.11 22 19V7C22 5.9 21.11 5 20 5M5 12H7.1C7.65 9.29 10.29 7.55 13 8.1C13.76 8.25 14.43 8.59 15 9L13.56 10.45C13.11 10.17 12.58 10 12 10C10.74 10 9.6 10.8 9.18 12H11L8 15L5 12M16.91 14C16.36 16.71 13.72 18.45 11 17.9C10.25 17.74 9.58 17.41 9 17L10.44 15.55C10.9 15.83 11.43 16 12 16C13.27 16 14.41 15.2 14.83 14H13L16 11L19 14H16.91Z" />
    ),
    viewBox: "0 0 24 24",
  },
  Check: {
    svg: (
      <Path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M68.5351 2.20035C69.4724 3.12861 69.999 4.38744 69.999 5.7C69.999 7.01256 69.4724 8.27139 68.5351 9.19965L28.5351 48.7997C27.5974 49.7276 26.3259 50.2489 25.0001 50.2489C23.6743 50.2489 22.4027 49.7276 21.4651 48.7997L1.46508 28.9996C0.554292 28.0661 0.0503204 26.8157 0.0617125 25.5178C0.0731045 24.2199 0.598949 22.9784 1.52599 22.0606C2.45303 21.1429 3.70709 20.6223 5.01808 20.611C6.32906 20.5997 7.59207 21.0987 8.53508 22.0004L25.0001 38.3007L61.4651 2.20035C62.4027 1.27237 63.6743 0.751057 65.0001 0.751057C66.3259 0.751057 67.5975 1.27237 68.5351 2.20035Z"
      />
    ),
    viewBox: "0 0 70 51",
  },
  CoinSolid: {
    svg: (
      <Path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm1 16.947v1.053h-1v-.998c-1.035-.018-2.106-.265-3-.727l.455-1.644c.956.371 2.229.765 3.225.54 1.149-.26 1.384-1.442.114-2.011-.931-.434-3.778-.805-3.778-3.243 0-1.363 1.039-2.583 2.984-2.85v-1.067h1v1.018c.724.019 1.536.145 2.442.42l-.362 1.647c-.768-.27-1.617-.515-2.443-.465-1.489.087-1.62 1.376-.581 1.916 1.712.805 3.944 1.402 3.944 3.547.002 1.718-1.343 2.632-3 2.864z" />
    ),
    viewBox: "0 0 24 24",
  },
  Crown: {
    svg: (
      <Path d="M3 16l-3-10 7.104 4 4.896-8 4.896 8 7.104-4-3 10h-18zm0 2v4h18v-4h-18z" />
    ),
    viewBox: "0 0 24 24",
  },
  DownArrow: {
    svg: (
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M37.9442 23.3058C38.4598 23.8216 38.7494 24.5209 38.7494 25.2501C38.7494 25.9793 38.4598 26.6786 37.9442 27.1943L21.4442 43.6943C20.9285 44.2099 20.2292 44.4995 19.5 44.4995C18.7708 44.4995 18.0714 44.2099 17.5557 43.6943L1.05573 27.1943C0.55479 26.6757 0.277606 25.981 0.283872 25.26C0.290137 24.539 0.579354 23.8492 1.08923 23.3393C1.5991 22.8295 2.28883 22.5403 3.00987 22.534C3.73092 22.5277 4.42557 22.8049 4.94423 23.3058L16.75 35.1116L16.75 3.2501C16.75 2.52075 17.0397 1.82128 17.5554 1.30555C18.0712 0.789828 18.7706 0.500099 19.5 0.500099C20.2293 0.500099 20.9288 0.789828 21.4445 1.30555C21.9602 1.82128 22.25 2.52075 22.25 3.2501L22.25 35.1116L34.0557 23.3058C34.5714 22.7903 35.2708 22.5007 36 22.5007C36.7292 22.5007 37.4285 22.7903 37.9442 23.3058V23.3058Z"
      />
    ),
    viewBox: "0 0 39 45",
  },
  Horse: {
    svg: (
      <G>
        <Path
          d="M7.2,16l1.1-0.2c1.6-0.3,3.3-0.5,5-0.7c-2.4,2.3-3.9,5.3-4.7,7.9h14.7c0.4-1.5,1.1-3,2.3-4.1l0.2-0.2
		c0.2-0.2,0.3-0.4,0.3-0.6C26.6,13,24.2,8,19.8,5.3c-0.8-1.4-2-2.4-3.6-2.9l-0.9-0.3C15,2,14.7,2,14.4,2.2C14.2,2.4,14,2.7,14,3v2.4
		l-1.4,0.7C12.2,6.3,12,6.6,12,7v0.5l-4.7,3.1C6.5,11.1,6,12.1,6,13.1V15c0,0.3,0.1,0.6,0.4,0.8C6.6,16,6.9,16,7.2,16z"
        />
        <Path d="M6.8,25C6.3,25.5,6,26.2,6,27v2c0,0.6,0.4,1,1,1h18c0.6,0,1-0.4,1-1v-2c0-0.8-0.3-1.5-0.8-2H6.8z" />
      </G>
    ),
    viewBox: "0 0 32 32",
  },
  Location: {
    svg: (
      <Path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M11.0076 10.8575C17.7686 4.09647 26.9386 0.298157 36.5001 0.298157C46.0617 0.298157 55.2316 4.09647 61.9926 10.8575C68.7536 17.6185 72.5519 26.7885 72.5519 36.35C72.5519 45.9115 68.7536 55.0815 61.9926 61.8425L36.5001 87.335L11.0076 61.8425C7.65967 58.4949 5.00392 54.5206 3.192 50.1466C1.38009 45.7726 0.44751 41.0845 0.44751 36.35C0.44751 31.6155 1.38009 26.9274 3.192 22.5534C5.00392 18.1794 7.65967 14.2051 11.0076 10.8575ZM36.5001 46.65C39.2318 46.65 41.8517 45.5648 43.7833 43.6332C45.7149 41.7016 46.8001 39.0817 46.8001 36.35C46.8001 33.6183 45.7149 30.9984 43.7833 29.0668C41.8517 27.1352 39.2318 26.05 36.5001 26.05C33.7684 26.05 31.1485 27.1352 29.2169 29.0668C27.2853 30.9984 26.2001 33.6183 26.2001 36.35C26.2001 39.0817 27.2853 41.7016 29.2169 43.6332C31.1485 45.5648 33.7684 46.65 36.5001 46.65Z"
      />
    ),
    viewBox: "0 0 73 88",
  },
  Logo: {
    svg: (
      <>
        <Path
          d="M2.85 100V65H21.55C26.3833 65 29.95 65.8667 32.25 67.6C34.55 69.3 35.7 71.4833 35.7 74.15C35.7 75.9167 35.2 77.5 34.2 78.9C33.2333 80.2667 31.8167 81.35 29.95 82.15C28.0833 82.95 25.7833 83.35 23.05 83.35L24.05 80.65C26.7833 80.65 29.1333 81.0333 31.1 81.8C33.1 82.5667 34.6333 83.6833 35.7 85.15C36.8 86.5833 37.35 88.3167 37.35 90.35C37.35 93.3833 36.0833 95.75 33.55 97.45C31.05 99.15 27.3833 100 22.55 100H2.85ZM14.45 91.75H21.55C22.85 91.75 23.8167 91.5167 24.45 91.05C25.1167 90.5833 25.45 89.9 25.45 89C25.45 88.1 25.1167 87.4167 24.45 86.95C23.8167 86.4833 22.85 86.25 21.55 86.25H13.65V78.45H19.95C21.2833 78.45 22.25 78.2333 22.85 77.8C23.4833 77.3333 23.8 76.6833 23.8 75.85C23.8 74.9833 23.4833 74.3333 22.85 73.9C22.25 73.4667 21.2833 73.25 19.95 73.25H14.45V91.75ZM86.4926 100V65H98.2926V90.85H114.093V100H86.4926ZM117.352 100V65H129.152V90.85H144.952V100H117.352Z"
          fill="#F77F00"
        />
        <Path
          d="M2.85 48V13H12.55L26.55 35.85H21.45L35.05 13H44.75L44.85 48H34.1L34 29.2H35.7L26.4 44.85H21.2L11.5 29.2H13.6V48H2.85ZM95.5258 48V13H105.226L123.026 34.3H118.526V13H130.026V48H120.326L102.526 26.7H107.026V48H95.5258ZM146.511 26H162.111V34.5H146.511V26ZM147.311 39.1H164.811V48H135.711V13H164.161V21.9H147.311V39.1ZM178.11 48V32.65L180.81 39.7L164.91 13H177.36L188.11 31.25H180.86L191.71 13H203.11L187.31 39.7L189.91 32.65V48H178.11Z"
          fill="#FCBF49"
        />
        <G clipPath="url(#clip0_16_1743)">
          <Path
            d="M61.7499 15.3447C53.3803 20.1769 50.5123 30.8806 55.3445 39.2502C60.1767 47.6198 70.8803 50.4878 79.2499 45.6556C87.6195 40.8234 90.4876 30.1198 85.6554 21.7502C80.8232 13.3806 70.1195 10.5125 61.7499 15.3447ZM75.3701 36.0188L76.1379 37.3487L74.8749 38.0779L74.1472 36.8175C72.8269 37.5494 71.2942 38.0184 69.8283 38.0868L69.2041 35.6787C70.6821 35.4502 72.5771 35.0196 73.6709 34.0092C74.9325 32.843 74.3674 31.1788 72.3485 31.3862C70.8563 31.517 66.9901 33.1244 65.2124 30.0453C64.2186 28.3239 64.6412 26.0255 66.9029 24.27L66.1249 22.9224L67.3879 22.1933L68.1302 23.479C69.0584 22.975 70.1758 22.5421 71.5206 22.2288L72.2643 24.5728C71.0975 24.7918 69.8466 25.1015 68.8398 25.7669C67.0227 26.9625 67.7972 28.686 69.5032 28.6104C72.2523 28.3787 75.5065 27.5052 77.0706 30.2142C78.3258 32.3825 77.2936 34.5176 75.3701 36.0188Z"
            fill="#6FCF97"
          />
        </G>
        <G clipPath="url(#clip1_16_1743)">
          <Path
            d="M44.9776 72.1546C46.0964 72.673 47.0925 73.3689 47.993 74.2694C49.8213 76.0978 50.8446 78.2672 51.0629 80.7777L42.4943 80.7777C42.6854 77.6941 43.5313 74.8015 44.9776 72.1546ZM69.6055 83.6021C70.2877 88.2957 72.7028 91.6932 76.837 93.7807C76.5914 94.1082 76.1138 94.6676 75.3907 95.3908C73.9853 96.7961 72.0751 98.0241 69.701 99.1156C67.3406 100.194 65.1575 100.794 63.1791 100.917L63.1518 83.6703L69.6055 83.6021ZM51.0084 83.6703C50.3671 87.2042 48.3887 89.783 45.0458 91.4066C43.6677 88.9097 42.8082 86.3037 42.5626 83.6567L51.0084 83.6703ZM60.341 83.6703L60.3138 100.917C54.7605 100.548 50.1897 98.1605 46.6558 93.7807C47.8429 93.1667 48.9754 92.3344 50.0396 91.2702C50.8856 90.4242 51.6906 89.2372 52.441 87.7227C53.1914 86.2082 53.669 84.8301 53.8873 83.6021L60.341 83.6703ZM53.9828 80.805C53.8464 78.4036 53.0823 76.2206 51.7452 74.2285C50.3944 72.2501 48.7025 70.7492 46.6422 69.7259C46.9014 69.3848 47.379 68.8254 48.1021 68.1022C49.5075 66.6969 51.4177 65.4689 53.7918 64.3773C56.1523 63.2994 58.3353 62.6991 60.3138 62.5763L60.2728 80.7914L53.9828 80.805ZM72.4299 80.7777C72.8528 76.6981 74.8858 73.8192 78.5152 72.1546C79.1429 73.2188 79.7023 74.5969 80.1662 76.3161C80.6301 78.008 80.903 79.5088 80.9985 80.7777L72.4299 80.7777ZM78.5016 91.3521C77.3964 90.8199 76.4004 90.1241 75.4998 89.2235C74.0126 87.7363 73.0166 85.8671 72.5527 83.6021L80.9303 83.6567C80.6301 86.3582 79.8251 88.9097 78.5016 91.3521ZM63.22 80.7914L63.1791 62.5763C68.7323 62.9447 73.3031 65.3324 76.8506 69.7259C75.6499 70.3262 74.5174 71.1585 73.4532 72.2228C72.4708 73.2052 71.5839 74.5287 70.7926 76.2206C70.0148 77.8988 69.5509 79.3997 69.51 80.805L63.22 80.7914Z"
            fill="#F77F00"
          />
        </G>
        <Defs>
          <ClipPath id="clip0_16_1743">
            <Rect
              width="35"
              height="35"
              fill="white"
              transform="translate(46.5945 24.0947) rotate(-30)"
            />
          </ClipPath>
          <ClipPath id="clip1_16_1743">
            <Rect
              width="46.3102"
              height="46.3102"
              fill="white"
              transform="translate(61.7463 49) rotate(45)"
            />
          </ClipPath>
        </Defs>
      </>
    ),
    viewBox: "0 0 220 125",
  },
  Map: {
    svg: (
      <Path d="M17.492 15.432c-.433 0-.855-.087-1.253-.259l.467-1.082c.25.107.514.162.786.162.222 0 .441-.037.651-.11l.388 1.112c-.334.118-.683.177-1.039.177zm-10.922-.022c-.373 0-.741-.066-1.093-.195l.407-1.105c.221.081.451.122.686.122.26 0 .514-.05.754-.148l.447 1.09c-.382.157-.786.236-1.201.236zm8.67-.783l-1.659-.945.583-1.024 1.66.945-.584 1.024zm-6.455-.02l-.605-1.011 1.639-.981.605 1.011-1.639.981zm3.918-1.408c-.243-.101-.5-.153-.764-.153-.23 0-.457.04-.674.119l-.401-1.108c.346-.125.708-.188 1.075-.188.42 0 .83.082 1.217.244l-.453 1.086zm7.327-.163c-.534 0-.968.433-.968.968 0 .535.434.968.968.968.535 0 .969-.434.969-.968 0-.535-.434-.968-.969-.968zm-16.061 0c-.535 0-.969.433-.969.968 0 .535.434.968.969.968s.969-.434.969-.968c0-.535-.434-.968-.969-.968zm18.031-.832v6.683l-4 2.479v-4.366h-1v4.141l-4-2.885v-3.256h-2v3.255l-4 2.885v-4.14h-1v4.365l-4-2.479v-13.294l4 2.479v3.929h1v-3.927l4-2.886v4.813h2v-4.813l1.577 1.138c-.339-.701-.577-1.518-.577-2.524l.019-.345-2.019-1.456-5.545 4-6.455-4v18l6.455 4 5.545-4 5.545 4 6.455-4v-11.618l-.039.047c-.831.982-1.614 1.918-1.961 3.775zm2-8.403c0-2.099-1.9-3.801-4-3.801s-4 1.702-4 3.801c0 3.121 3.188 3.451 4 8.199.812-4.748 4-5.078 4-8.199zm-5.5.199c0-.829.672-1.5 1.5-1.5s1.5.671 1.5 1.5-.672 1.5-1.5 1.5-1.5-.671-1.5-1.5zm-.548 8c-.212-.992-.547-1.724-.952-2.334v2.334h.952z" />
    ),
    viewBox: "0 0 24 24",
  },
  Medal: {
    svg: (
      <Path d="M12 14c-2.762 0-5 2.239-5 5s2.238 5 5 5 5-2.239 5-5-2.238-5-5-5zm1.544 7.211l-1.544-.827-1.544.827.308-1.725-1.264-1.215 1.735-.239.765-1.576.765 1.577 1.735.239-1.264 1.214.308 1.725zm5.456-12.211l-7 4-7-4 2-6 4 6-3-9h8l3 9z" />
    ),
    viewBox: "0 0 24 24",
  },
  Pig: {
    svg: (
      <Path d="M213.705 344.935l2.7 53.87h-26.24l-19.46-55.41zm150.56.33l-.34 4.38 18.15 49.16h24.44l-5.66-56.51a326.16 326.16 0 0 1-36.57 2.97zm32.79-164.08a90.06 90.06 0 0 0 13.05-1.12c51.2-7.62 36.49-49.56 36.49-49.56s-40.36 9-52.83 23.42c.02 0-28.12 27.26 3.31 27.26zm81.85-25.33s-6.81 0-15.92.82a47 47 0 0 1-13.28 22.9 116.55 116.55 0 0 1 7.44 14.09c25.25-9.43 21.79-37.81 21.79-37.81zm11.8 100.18v41.49s-53.15 31.9-134.5 31.9c-2.19 0-4.44-.15-6.67-.2l-5.48 69.58h-19l-24.45-66.86-162.59-5.87-9.4 72.73h-22.63s-48.15-101.58-23.18-182.06c-5.55-3.84-11.38-8.17-16.73-12.7-5.13 2.65-10.26 4.11-15 3.85-15.76-.85-28.37-12.73-29.78-14.09l11.16-11.46c2.6 2.5 11.21 9.13 19.48 9.57a7.93 7.93 0 0 0 1.7-.11 46.36 46.36 0 0 1-4.59-6.47c-5.65-9.83-7-20.32-3.84-28.79a25.1 25.1 0 0 1 15.94-14.87c11.29-3.81 26.85-3.35 34.75 4.9 2.94 3.07 7.24 9.84 3 20.7-3.59 9.29-10.85 19.34-19.36 27.12 2.87 2.3 5.94 4.61 9.09 6.87 9.46-20.85 24.84-39.58 48.52-53.76a238.9 238.9 0 0 1 124-34.31 259.14 259.14 0 0 1 120.54 30.12 80.94 80.94 0 0 0-7.77 9.25c-7.6 10.67-9.67 20.49-6.15 29.19 2.85 7 10.23 15.42 29.24 15.42a105 105 0 0 0 15.41-1.3 80.49 80.49 0 0 0 24-7.18c15.75 25.72 17.22 58.67 28 61 12.79 2.72 26.29 6.34 26.29 6.34zm-406.69-94.52c.43-1.12 1.05-3.11.32-3.87-1.32-1.38-4.81-2.26-8.92-2.26a29.18 29.18 0 0 0-9.16 1.42c-3.13 1.05-5.12 2.81-6.09 5.38-1.46 3.95-.46 9.62 2.75 15.19a36.3 36.3 0 0 0 4.79 6.25c6.66-5.82 13.19-14.04 16.31-22.11zm331.14 81.55a9.05 9.05 0 1 0-9.05 9.05 9.05 9.05 0 0 0 9.05-9.05z" />
    ),
    viewBox: "0 0 512 512",
  },
  Save: {
    svg: (
      <Path d="M30.8472 39.5529C30.3583 39.0467 29.7735 38.6429 29.1268 38.3652C28.4802 38.0874 27.7848 37.9412 27.081 37.9351C26.3773 37.929 25.6794 38.0631 25.028 38.3295C24.3767 38.596 23.7849 38.9896 23.2873 39.4872C22.7897 39.9848 22.3961 40.5766 22.1296 41.2279C21.8632 41.8793 21.7291 42.5772 21.7352 43.2809C21.7413 43.9847 21.8875 44.6801 22.1653 45.3267C22.443 45.9734 22.8468 46.5582 23.353 47.0471L39.253 62.9471C40.2469 63.9407 41.5947 64.4989 43.0001 64.4989C44.4055 64.4989 45.7533 63.9407 46.7472 62.9471L62.6472 47.0471C63.6126 46.0475 64.1468 44.7087 64.1348 43.3191C64.1227 41.9294 63.5653 40.6001 62.5826 39.6175C61.6 38.6348 60.2707 38.0774 58.881 38.0653C57.4914 38.0533 56.1526 38.5875 55.153 39.5529L48.3001 46.4058V16.8H74.8001C77.6114 16.8 80.3075 17.9168 82.2954 19.9047C84.2833 21.8926 85.4001 24.5887 85.4001 27.4V64.5C85.4001 67.3113 84.2833 70.0074 82.2954 71.9953C80.3075 73.9832 77.6114 75.1 74.8001 75.1H11.2001C8.3888 75.1 5.69265 73.9832 3.70477 71.9953C1.71688 70.0074 0.600098 67.3113 0.600098 64.5V27.4C0.600098 24.5887 1.71688 21.8926 3.70477 19.9047C5.69265 17.9168 8.3888 16.8 11.2001 16.8H37.7001V46.4058L30.8472 39.5529V39.5529ZM37.7001 6.2C37.7001 4.79435 38.2585 3.44628 39.2524 2.45234C40.2464 1.45839 41.5944 0.900002 43.0001 0.900002C44.4057 0.900002 45.7538 1.45839 46.7478 2.45234C47.7417 3.44628 48.3001 4.79435 48.3001 6.2V16.8H37.7001V6.2Z" />
    ),
    viewBox: "0 0 86 76",
  },
  Share: {
    svg: (
      <Path d="M79.5001 42.4C82.7286 42.4001 85.8806 41.4174 88.5371 39.5825C91.1935 37.7476 93.2284 35.1476 94.3712 32.1281C95.514 29.1086 95.7105 25.8128 94.9346 22.6789C94.1587 19.545 92.4472 16.7215 90.0276 14.584C87.6081 12.4465 84.5951 11.0961 81.3895 10.7126C78.1839 10.3291 74.9374 10.9305 72.0819 12.4368C69.2263 13.9432 66.897 16.2832 65.4037 19.1456C63.9104 22.008 63.3238 25.2571 63.722 28.461L37.54 41.552C35.294 39.3862 32.4604 37.929 29.3922 37.3621C26.3241 36.7951 23.1569 37.1434 20.2852 38.3635C17.4135 39.5837 14.9643 41.6218 13.2427 44.2239C11.521 46.826 10.603 49.8772 10.603 52.9973C10.603 56.1175 11.521 59.1687 13.2427 61.7708C14.9643 64.3729 17.4135 66.411 20.2852 67.6312C23.1569 68.8513 26.3241 69.1996 29.3922 68.6326C32.4604 68.0657 35.294 66.6085 37.54 64.4427L63.722 77.5337C63.2582 81.2556 64.1251 85.0216 66.1694 88.1661C68.2137 91.3107 71.3038 93.6313 74.8936 94.7179C78.4834 95.8044 82.3418 95.587 85.7868 94.104C89.2318 92.621 92.0417 89.9679 93.7198 86.6136C95.3979 83.2593 95.8361 79.4197 94.9572 75.7735C94.0782 72.1273 91.9386 68.9092 88.9164 66.688C85.8943 64.4667 82.1842 63.3854 78.4418 63.635C74.6995 63.8846 71.1659 65.4491 68.4655 68.052L42.2835 54.961C42.4439 53.6586 42.4439 52.3414 42.2835 51.039L68.4655 37.948C71.3169 40.704 75.2071 42.4 79.5001 42.4Z" />
    ),
    viewBox: "0 0 106 106",
  },
  Ticket: {
    svg: (
      <Path d="M155.872 146.8L115 120.542L74.1282 146.8L86.4582 99.7633L48.8974 69.1666L97.4182 66.1983L115 21.2166L132.582 66.1983L181.102 69.1666L143.542 99.7633M206.333 92C206.333 79.3275 216.608 69.1666 229.167 69.1666V23.5C229.167 10.8275 218.892 0.666626 206.333 0.666626H23.6666C17.6108 0.666626 11.8031 3.07227 7.52098 7.35435C3.2389 11.6364 0.833252 17.4442 0.833252 23.5V69.1666C13.5058 69.1666 23.6666 79.4416 23.6666 92C23.6666 98.0557 21.2609 103.863 16.9789 108.146C12.6968 112.428 6.88903 114.833 0.833252 114.833V160.5C0.833252 166.556 3.2389 172.363 7.52098 176.646C11.8031 180.928 17.6108 183.333 23.6666 183.333H206.333C212.389 183.333 218.197 180.928 222.479 176.646C226.761 172.363 229.167 166.556 229.167 160.5V114.833C223.111 114.833 217.303 112.428 213.021 108.146C208.739 103.863 206.333 98.0557 206.333 92Z" />
    ),
    viewBox: "0 0 230 184",
  },
  UpArrow: {
    svg: (
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1.05577 21.6942C0.540227 21.1784 0.25061 20.4791 0.25061 19.7499C0.25061 19.0207 0.540227 18.3214 1.05577 17.8057L17.5558 1.30565C18.0715 0.790105 18.7708 0.500488 19.5 0.500488C20.2292 0.500488 20.9286 0.790105 21.4443 1.30565L37.9443 17.8057C38.4452 18.3243 38.7224 19.019 38.7161 19.74C38.7099 20.461 38.4206 21.1508 37.9108 21.6607C37.4009 22.1705 36.7112 22.4597 35.9901 22.466C35.2691 22.4723 34.5744 22.1951 34.0558 21.6942L22.25 9.8884V41.7499C22.25 42.4792 21.9603 43.1787 21.4446 43.6944C20.9288 44.2102 20.2294 44.4999 19.5 44.4999C18.7707 44.4999 18.0712 44.2102 17.5555 43.6944C17.0398 43.1787 16.75 42.4792 16.75 41.7499V9.8884L4.94427 21.6942C4.42857 22.2097 3.72922 22.4993 3.00002 22.4993C2.27082 22.4993 1.57147 22.2097 1.05577 21.6942V21.6942Z"
      />
    ),
    viewBox: "0 0 39 45",
  },
  X: {
    svg: (
      <Path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M1.82614 1.82615C2.86692 0.785688 4.27833 0.201187 5.74999 0.201187C7.22165 0.201187 8.63306 0.785688 9.67383 1.82615L33.5 25.6523L57.3261 1.82615C57.8381 1.29607 58.4505 0.873259 59.1276 0.582389C59.8048 0.291519 60.533 0.138415 61.27 0.132011C62.0069 0.125607 62.7377 0.266031 63.4198 0.54509C64.1019 0.824149 64.7215 1.23625 65.2426 1.75736C65.7637 2.27846 66.1758 2.89813 66.4549 3.58021C66.7339 4.26228 66.8744 4.9931 66.868 5.73003C66.8616 6.46695 66.7085 7.19522 66.4176 7.87234C66.1267 8.54947 65.7039 9.16188 65.1738 9.67385L41.3477 33.5L65.1738 57.3261C66.1848 58.3729 66.7442 59.7748 66.7316 61.23C66.7189 62.6852 66.1352 64.0772 65.1062 65.1062C64.0772 66.1353 62.6852 66.7189 61.23 66.7316C59.7748 66.7442 58.3729 66.1848 57.3261 65.1738L33.5 41.3477L9.67383 65.1738C8.62709 66.1848 7.22515 66.7442 5.76996 66.7316C4.31477 66.7189 2.92276 66.1353 1.89374 65.1062C0.864729 64.0772 0.281039 62.6852 0.268394 61.23C0.255749 59.7748 0.81516 58.3729 1.82614 57.3261L25.6523 33.5L1.82614 9.67385C0.785673 8.63307 0.201172 7.22166 0.201172 5.75C0.201172 4.27834 0.785673 2.86693 1.82614 1.82615Z"
      />
    ),
    viewBox: "0 0 67 67",
  },
};
