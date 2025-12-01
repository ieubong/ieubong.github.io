

import { MemoryLocation, ThemePack, MiniPlayerTheme } from './types';

// --- MINI PLAYER THEMES ---
export const MINI_PLAYER_THEMES: MiniPlayerTheme[] = [
  {
    id: 'midnight',
    label: 'Midnight',
    bgClass: 'bg-black/80 border-white/10',
    textClass: 'text-white',
    subTextClass: 'text-zinc-400',
    progressGradient: 'bg-gradient-to-r from-green-400 to-emerald-500',
    progressShadow: 'shadow-[0_0_10px_rgba(74,222,128,0.5)]',
    buttonClass: 'bg-white/10 hover:bg-white/20 text-white',
    iconColorClass: 'text-white'
  },
  {
    id: 'strawberry',
    label: 'Strawberry Milk',
    bgClass: 'bg-gradient-to-br from-pink-100/90 via-pink-200/90 to-rose-200/90 border-white/40 shadow-rose-200/50',
    textClass: 'text-rose-900',
    subTextClass: 'text-rose-700/70',
    progressGradient: 'bg-gradient-to-r from-rose-400 to-pink-500',
    progressShadow: 'shadow-[0_0_10px_rgba(244,63,94,0.5)]',
    buttonClass: 'bg-white/40 hover:bg-white/60 text-rose-900',
    iconColorClass: 'text-rose-900'
  },
  {
    id: 'blueberry',
    label: 'Blueberry Fizz',
    bgClass: 'bg-gradient-to-br from-cyan-100/90 via-blue-100/90 to-indigo-200/90 border-white/40 shadow-blue-200/50',
    textClass: 'text-slate-800',
    subTextClass: 'text-slate-600/70',
    progressGradient: 'bg-gradient-to-r from-cyan-400 to-blue-500',
    progressShadow: 'shadow-[0_0_10px_rgba(59,130,246,0.5)]',
    buttonClass: 'bg-white/40 hover:bg-white/60 text-blue-900',
    iconColorClass: 'text-blue-900'
  }
];

// --- THEME PACKS DEFINITIONS ---

export const THEME_PACKS: Record<string, ThemePack> = {
  zootopia: {
    id: 'zootopia',
    label: 'Zootopia',
    weather: 'petal',
    icon: 'paw',
    mapUrl: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
    colors: { // Default Fallback
      primary: 'bg-pink-500', secondary: 'bg-purple-500', bgGradient: 'bg-white', panelBg: 'bg-white', text: 'text-black', subText: 'text-gray-500', dockBg: 'bg-white'
    },
    variants: [
      {
        id: 'judy',
        label: 'Judy (Bunnyburrow)',
        colors: {
          primary: 'bg-gradient-to-r from-pink-500 to-rose-500',
          secondary: 'bg-purple-400',
          bgGradient: 'bg-gradient-to-br from-blue-300 via-purple-200 to-pink-200',
          panelBg: 'glass-morphism', 
          text: 'text-gray-900',
          subText: 'text-gray-600',
          dockBg: 'bg-white/80',
        }
      },
      {
        id: 'nick',
        label: 'Nick (Downtown)',
        iconOverride: 'paw',
        colors: {
          primary: 'bg-gradient-to-r from-orange-500 to-amber-600',
          secondary: 'bg-green-600',
          bgGradient: 'bg-gradient-to-br from-slate-900 via-orange-900 to-black', 
          panelBg: 'glass-dark', 
          text: 'text-zinc-50', 
          subText: 'text-zinc-400', 
          dockBg: 'bg-black/80',
        }
      }
    ]
  },
  christmas: {
    id: 'christmas',
    label: 'Christmas',
    weather: 'snow',
    icon: 'tree',
    mapUrl: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    colors: { primary: '', secondary: '', bgGradient: '', panelBg: '', text: '', subText: '', dockBg: '' },
    variants: [
      {
        id: 'santa',
        label: 'Santa Red',
        colors: {
          primary: 'bg-gradient-to-r from-red-600 to-red-800',
          secondary: 'bg-green-700',
          bgGradient: 'bg-gradient-to-b from-slate-900 via-red-950 to-slate-900',
          panelBg: 'glass-dark',
          text: 'text-red-50',
          subText: 'text-red-200/80', 
          dockBg: 'bg-black/90',
        }
      }
    ]
  },
  valentine: {
    id: 'valentine',
    label: 'Valentine',
    weather: 'heart',
    icon: 'heart',
    mapUrl: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    colors: { primary: '', secondary: '', bgGradient: '', panelBg: '', text: '', subText: '', dockBg: '' },
    variants: [
      {
        id: 'sweet',
        label: 'Sweet Love',
        colors: {
          primary: 'bg-gradient-to-r from-rose-400 to-pink-500',
          secondary: 'bg-pink-300',
          bgGradient: 'bg-gradient-to-tr from-rose-100 via-pink-100 to-white',
          panelBg: 'glass-morphism',
          text: 'text-rose-950', 
          subText: 'text-rose-500', 
          dockBg: 'bg-white/95',
        }
      }
    ]
  }
};

export const LYRICS_ENCHANTED = `...`; // (Truncated for brevity, assuming standard content)

export const MEMORY_DATA: MemoryLocation[] = [
    {
      "lat": 21.03160360296427,
      "lng": 105.81279591265658,
      "ggmaps": "https://maps.app.goo.gl/UtzSzmh1QsN3xC7f9",
      "name": "Lotte Center Hanoi 🏬",
      "detail": [
        {
          "date": "18:44 04/12/2024",
          "img": "../images/2024122x-vinacomin.jpg", 
          "rating": 5,
          "mood": "romantic",
          "desc": "Mình mới lên HN và tới văn phòng làm được 2 ngày. Ở HN mình có cảm giác lạ lẫm nhưng lại rất quen thuộc. Tháng 12 này đang là mùa đông, trời rất là lạnh luôn. Nhưng mà hôm nay mình được lần đầu chở đi cháy phố. Nói là tráy thế thui chứ thực ra là được chở về nhà. À còn một điều quan trọng là mình được tặng một món quà rất là dễ thương nữaa. Mình sẽ gìn giữ món quà này thật cẩn thận."
        }
      ]
    },
    // ... (Existing Data)
    {
      "lat": 21.033546553526204,
      "lng": 105.77673667714092,
      "ggmaps": "https://maps.app.goo.gl/sH2wy4Bu52gVQxE77",
      "name": "58/3 Trần Bình 🏠",
      "type": "home",
      "detail": [
        {
          "date": "19:32 23/02/2025",
          "img": "https://picsum.photos/400/300?random=2",
          "rating": 4,
          "mood": "chill",
          "desc": "Con bé cũng với bạn con bé đi mua hoa, trong lúc đó con bé cũng tranh thủ mua cây và nói mình ở nhà để con bé qua cho. Đến tầm 19h20 mình xuống nhận túi cây con bé tặng. 2 đứa chào nhau và mình lên phòng bắt đầu ngắm nghía. Đây là cây Cẩm Nhung, theo như mình đọc tờ giấy hướng dẫn thì cây cần có ánh sáng 8 tiếng 1 ngày và 1 tuần chỉ cần tưỡi đậm nước 2-3 lần. Cả cái chậu câu cùng cái lá của cây trông cũng nhỏ nhắn và đáng yêu. Nhưng vì đây là lần đầu chăm sóc cây nên mình cũng rất lo, mong là bạn Cẩm Nhung này trộm vía khỏe mạnh nhaa."
        },

        {
          "date": "17:50 22/02/2025",
          "img": "https://picsum.photos/400/300?random=3",
          "rating": 5,
          "mood": "happy",
          "desc": "Nay mình có hẹn con bé qua lấy tinh chất giảm thâm mà mình đã săn hộ đơn shopee cho. Đồng thời mình cũng gói luôn hộp quà tặng con bé full combo kẹp tóc mà mình có tìm hiểu được. Thấy ăn uống tội quá, với lại thấy bảo bị loot mất cái kẹp tóc. Tính ra sau này mình thấy mấy cái dây, vòng kẹp tóc mình mua con bé dùng hợp phết chứ đùa. Xời quá là tuyệt hihi."
        },

        {
          "date": "22:00 10/12/2024",
          "img": "https://picsum.photos/400/300?random=4",
          "rating": 4,
          "mood": "foodie",
          "desc": "Nay mình tập văn nghệ YEP tại công ty muộn mới về. Về nhà được hỏi là có muốn ăn cơm không, tấc nhiên là có roài. Thế là sau đó được cho 1 bát cơm thế này nè, ahihi."
        }
      ]
    },
    {
      "lat": 21.03453056879763,
      "lng": 105.782795321752,
      "ggmaps": "https://maps.app.goo.gl/4K8oWDU6dgKJcLwq7",
      "name": "Quán Bún Vịt Quay 🍜",
      "detail": [
        {
          "date": "11:59 14/12/2024",
          "img": "https://picsum.photos/400/300?random=5",
          "rating": 5,
          "mood": "foodie",
          "desc": "Chúng mình đi ăn bún vịt nướng ở đây do nghe lói trên top top quán rất là nổi tiếng và ngonn. Đây cũng là lần đầu tiên về HN đi ăn cùng nhao và rất lâu ròi mới thấy lại mặt nè (trước đó toàn thấy đeo khẩu trang khôngg). Vừa ăn vừa lói phét rất nhiều chuyện trên trời, mình thì cười hơ hớ hơi bị to (cảm thấy bản thân hơi vô duyên tẹoo)."
        }
      ]
    },
    {
      "lat": 21.014981512799476,
      "lng": 105.81217663385567,
      "ggmaps": "https://maps.app.goo.gl/rCmpP7TYrNaW1qB99",
      "name": "Chim Xanh Cafe ☕",
      "detail": [
        {
          "date": "13:12-18:04 14/12/2024",
          "img": "https://picsum.photos/400/300?random=6",
          "rating": 4,
          "mood": "chill",
          "desc": "Sau khi ăn xong bún vịt nướng, chúng mình đi tiếp tầm 7km đến quán cà phê này. Hoa nói là chỗ này thích hợp để chill, chụp ảnh các thứ và quan trọng nhất là để học. 🐥 Ừ đúng là để học thiệc, chúng mình sau khi nghịch ngợm chụp ảnh xong thì đứa bé này mới nhớ ra là cần support 1 thanh niên thi tiếng Anh. Rồi sau đó cả 2 đứa lao vào lòi mắt nhìn cái đề thằng bé chụp (chao ôi mắt toai) và support nó. Mình gáy là 1 IELTS và 1 TOEIC ở đây thì đúng là chúng mình sẽ công phá mọi đề!!! Và sau đó vì quá mệt mỏi nên chúng mình quyết định hỏi ChatGPT... <br>Sau cùng, mình giới thiệu cho Hoa về IELTS Listening và để cho đứa bé này tập trung làm bài (mãi mới đúng mục đích đến quán này)."
        }
      ]
    },
    {
      "lat": 21.036761726662636,
      "lng": 105.84770172478342,
      "ggmaps": "https://maps.app.goo.gl/VfNM6sFhXJAS8Xd6A",
      "name": "Phố Hàng Mã ☃️",
      "detail": [
        {
          "date": "18:19 14/12/2024",
          "img": "https://picsum.photos/400/300?random=7",
          "rating": 5,
          "mood": "romantic",
          "desc": "Hà Nội trong cái lạnh của mùa đông, các hàng quán phố Hàng Mã bán đồ trang trí Giáng Sinh đầy đủ sắc vàng, xanh, đỏ..., tất cả tạo nên một không khí thật ấm cúng. Đây là lần đầu mình biết đi chơi Giáng Sinh là như thế nào, chúng mình sẽ đi qua từng quán, chụp ảnh, ngắm đồ (cũm muốn mua 1 số thứ lắm cơ mà sợ mắc), rùi tất nhiên là sẽ lói phét và lạc đường một chút. Nghe hơi ngốc nhưng mà vui lémm. Hãy luôn cười thật nhèo nhéee.",
          "media": [
            "https://picsum.photos/400/300?random=8",
            "https://picsum.photos/400/300?random=9",
          ],
        }
      ]
    },
    {
      "lat": 21.02439296914177,
      "lng": 105.840952090882,
      "ggmaps": "https://maps.app.goo.gl/mjNcmgFBPNaFxMsd8",
      "name": "Ga Hà Nội 🚉",
      "detail": [
        {
          "date": "19:42 14/12/2024",
          "img": "https://picsum.photos/400/300?random=10",
          "rating": 4,
          "mood": "funny",
          "desc": "Đi 1 hồi Giáng Sinh ở Hàng Mã đói quá nên là tụi mình tạm biệt Hàng Mã và vác xe đi kiếm quán ăn. Trên đoạn đường đó thì vô tình đi qua Ga Hà Nội, mình thấy đẹp nên dừng xe lại để cả 2 đứa chụp ảnh."
        }
      ]
    },
    {
      "lat": 21.007734177098854,
      "lng": 105.83258263524807,
      "ggmaps": "https://maps.app.goo.gl/oow2neKAcZH5ebsw9",
      "name": "Nem nướng Nha Trang- Bún Đậu Mắm Tôm 🍡",
      "detail": [
        {
          "date": "19:57 14/12/2024",
          "img": "https://picsum.photos/400/300?random=11",
          "rating": 4,
          "mood": "funny",
          "desc": "Trên đường trở về từ Ga Hà Nội mà trước hơn đó là Giáng Sinh ở Hàng Mã. Hoa có tra ra chỗ này được đánh giá tích cực với số điểm rất cao trên Google Maps. Thế là không nghĩ nhèo, 2 đứa vào gọi món ăn luôn cho lóng. Mình thì thấy nước chấm bên này có mùi vị cũng rất thú vị và buồn cười nên vô tình đã khiến cho cả 2 có mấy trò lói phét cười ằng ặc."
        }
      ]
    },
    {
      "lat": 21.004251017193297,
      "lng": 105.83126645063315,
      "ggmaps": "https://maps.app.goo.gl/QNQ29sJ7NrF1R7Bd6",
      "name": "Ngõ 1A Tôn Thất Tùng 🚩",
      "detail": [
        {
          "date": "20:55 14/12/2024",
          "img": "https://picsum.photos/400/300?random=12",
          "rating": 5,
          "mood": "happy",
          "desc": "Đây là nơi đi chơi Giáng Sinh phù hợp với tụi sinh viên mới ra trường ít xèng như chúng mềnh. Hoa hỏi mình có biết tại sao Hoa lại biết chỗ này không. Nhìn con bé khi nói xong câu đấy cũng buồn, đúng là một nhịp hẫng trong tim con bé. Mới giờ này năm ngoái hai đứa nó từng rất đẹp đôi, đúng là cuộc sống luôn thử thách mỗi chúng ta. Dù sao thì sau đấy chúng mình lại đi khắp các hàng quán, ở đây mình đã tìm được đồ cần mua. Mình chọn tặng con bé cái đấm lưng có hình con cừu (theo Hoa mô tả là như thía) và 2 cái kéo khóa cho cái ba lô của mềnh."
        }
      ]
    },
    {
      "lat": 21.042473047044417,
      "lng": 105.76566211622475,
      "ggmaps": "https://maps.app.goo.gl/P1dgoKHSh78w7hnn8",
      "name": "Nhà sách Bảo Anh Hồ Tùng Mậu 📚",
      "detail": [
        {
          "date": "19:10 15/12/2024",
          "img": "",
          "rating": 3,
          "mood": "chaos",
          "desc": "Chúng mình vào đây để mua những đồ dùng cần thiết cho con bé chuẩn bị quà Giáng Sinh tại công ty. Ở đây chúng mềnh chọn giấy gấp quà, lơ các kiểu. Nhưng việc quan trọng nhất chính là phải tìm được cái hộp quà đủ to để có thể chứa nổi cái món quà gấu bông 50cm của con bé. Không may là ở đây không có hộp hay bìa các tông nào đủ to để có thể gói cả. Thế nhưng ảo giác thế nào, sau đó tụi mình có đi thêm 1 quán nữa để mua bánh mì và các đồ linh tinh, gặp được chị nhân viên tốt bụng có cho con bé 1 chiếc hộp ngon lành."
        }
      ]
    },
    {
      "lat": 21.022076583096776,
      "lng": 105.7897583844776,
      "ggmaps": "https://maps.app.goo.gl/hNuRdLyf4L5hzzzUA",
      "name": "Vinacomin Tower 🏬",
      "detail": [
        {
          "date": "12:26 06/06/2025",
          "img": "https://picsum.photos/400/300?random=13",
          "rating": 4,
          "mood": "chill",
          "desc": "."
        },
        {
          "date": "12:10 03/06/2025",
          "img": "https://picsum.photos/400/300?random=14",
          "rating": 4,
          "mood": "chill",
          "desc": "."
        },
        {
          "date": "06/01/2025",
          "img": "https://picsum.photos/400/300?random=15",
          "rating": 5,
          "mood": "chaos",
          "desc": "Đây là tòa nhà văn phòng mới của công ty mình. Những ngày đầu mình giúp các anh chị dọn dẹp chuyển đồ từ văn phòng cũ khá là vất vả. Ngoài ra mình còn phải ở lại tập văn nghệ nữa. Nên là có những hôm hơn 22h mới về tới nhà, mệt như con cá đuối luon. Nhưng mà công ty mình cũng vô tình rất gần với công ty con bé, khá là ảo ma uchiha. Thế là có những buổi con bé ở dưới sảnh công ty đợi mình, đơn giản là hẹn chở mình về hoặc là cuối tuần thì sẽ đi tráy phố chút ròi lói phét. Những lúc như thế vui thật. Dù cho có lạc đường, xi nhan trái rẽ phải hay là đi ngược chiều thì vẫn sẽ là những kỉ niệm quý giá và hài hước."
        }
      ]
    },
    {
      "lat": 21.031280246338017,
      "lng": 105.7827901918205,
      "ggmaps": "https://maps.app.goo.gl/2z1YHxMbyZ7J3rnt6",
      "name": "Công ty CP Công nghệ và Truyền thông Dagoras 🏬",
      "detail": [
        {
          "date": "08:47 29/10/2025",
          "img": "https://picsum.photos/400/300?random=16",
          "rating": 5,
          "mood": "happy",
          "desc": "Nay con bé đi làm mà quên không mang đồ ăn sáng. Sáng đến nơi ròi mà mọi người đã mua hết đồ ăn từ trước thì bướng con có vẻ buần lắm. Nhắn với mình là muốn xuống mua đồ ăn sáng mà lười, có người đi cùng thì sẽ tốt hơn. Mình bảo là sẽ mua đồ ăn rùi gửi dưới bảo vệ cho xuống lấy, sáng uống mỗi sữa sao có sức làm. Đúng hem. Con bé bảo thui không cần rồi còn bảo là sắp họp rùi. Mình phi xe đi mua bánh mì với snack rong biển gói vào túi bỏng đỏ rùi tới chỗ công ty con bé. Đến nơi mình dừng xe rùi vào gửi bảo vệ.\n <br> - \"Con gửi nhờ đồ ăn bạn Hoa để quên rồi tí bạn ấy xuống lấy được không ạ.\" <br> - \"Hoa nào ấy nhỉ?\" - bác bảo vệ thắc mắc cau cả mắt zô <br> - \"Dạ bạn Nguyễn Phương Hoa ở công ty Dagoras ấy bác...\" <br> - \"À ui giời con bé đấy tao suốt ngày gặp luon, thế cháu có chắc là bạn nó không??\" <br> - \"Dạ vâng đúng ạ...\" <br> - \"Khà khà à thế cơ à, ừ để đây đi\" <br> - \"Vâng ạ, con cảm ơn bác nhiều ạ! Con chào bác ạaaa\"", 
          "media": []
        }
      ]
    },
     {
      "lat": 21.026731748922778, 
      "lng": 105.85141849427755,
      "ggmaps": "https://maps.app.goo.gl/gnoM1PbAPEpxKDah9",
      "name": "Báo Hà Nội Mới, Hoàn Kiếm 🪧",
      "detail": [
        {
          "date": "19:30 19/04/2025",
          "img": "",
          "video": "",
          "rating": 3,
          "mood": "chill",
          "desc": "2 đứa mình mới chạy qua đây để ngắm thoi chứ chưa có chụp hình gì tại đây cả. Nghe lói đây là nơi các bạn trẻ sống ảo nhiều lắm. Nao có cơ hội thì chúng mình sẽ quay lại chụp, hihi."
        }
      ]
    },
    {
      "lat": 21.05216336377414,
      "lng": 105.81277711866485,
      "ggmaps": "https://maps.app.goo.gl/NM5mtFsaGUnYrSjHA",
      "name": "Hồ Tây 🌉",
      "detail": [
        {
          "date": "17:05 09/02/2025",
          "img": "https://picsum.photos/400/300?random=17",
          "rating": 5,
          "mood": "romantic",
          "desc": "Trên đường đi tráy phố tới photobooth thì chúng mình được đi xung quanh Hồ Tây một đoạn. Hoa có kể về thời ngày xưa của con bé - khi mà con bé tin rằng người đầu tiên con bé đi cùng đến Hồ Tây sẽ là tình yêu đích thực. Cơ mà hồi đó đi chơi bị lên xe buýt gì đó mà thành ra là đến Hồ Tây một mình nên con bé rất là dỗi. Sau đó thì con bé có cùng đám bạn đến đây chơi nhiều. Mà hiện tại thì vẫn cứ cay cú vì cái quả đi xe buýt một mình tới Hồ Tây. Mình thì cười hớ hớ, cũng kiểu an ủi là thoi có gì đâu. Cơ mà đây là lần đầu mình tới Hồ Tây. Ban đầu mình cứ nghĩ hồ thì chắc là nhỏ thui nhỉ, nhưng khi đi vòng quanh mới thấy là nó rộng thật ấy. Không chỉ rộng mà cảnh vật cũm đẹp nữa. Mọi người xung quanh cùng các hoạt động hàng quán khiến cho không khí xung quanh Hồ Tây trông cũng rất là nhộn nhịp nữa cơ."
        }
      ]
    }
];
