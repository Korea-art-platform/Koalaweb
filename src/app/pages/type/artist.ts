export type PortfolioItem = {
  id: string;
  title: string;
  category: string;
  image: string;
  type: 'available' | 'sold' | 'exhibition';
  price?: number;
};

export type Artist = {
  id: string;
  name: string;
  specialty: string;
  bio: string;
  location: string;
  image: string;
  studioImage: string;
  collectors: number;
  ipNotice: string;
  expansionDescription: string;
  portfolio: PortfolioItem[];
};

export const artists: Artist[] = [
  {
    id: '1',
    name: '박준상',
    specialty: '조각가',
    bio: '도자기로 시대상을 표현하는 작가',
    location: '서울, 대한민국',
    image: 'https://inartplatform.kr/attach/view/w3wjX7Ox87WPYENtwPpHiKPLdsoFPOBT',
    studioImage: 'https://t1.daumcdn.net/news/202107/10/munhwa/20210710153013243tjzm.jpg',
    collectors: 1240,
    ipNotice: '박준상 작가의 작품이 곧 다양한 굿즈와 협업으로 확장될 예정입니다.',
    expansionDescription:
      '박준상 작가는 도자라는 전통적 재료를 통해 시대의 감정과 사회적 메시지를 입체적으로 풀어냅니다. 그의 작업은 원작 조형물에서 출발해 아트 오브제, 리빙 컬렉션, 한정판 에디션으로 확장되며 KOALA 안에서 하나의 독창적인 IP 세계관으로 발전합니다.',
    portfolio: [
      {
        id: '101',
        title: '흙의 기록',
        category: 'Ceramic Sculpture',
        image:
          'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?auto=format&fit=crop&w=1200&q=80',
        type: 'available',
        price: 980,
      },
      {
        id: '102',
        title: '시대의 표정',
        category: 'Sculpture',
        image:
          'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1200&q=80',
        type: 'sold',
      },
      {
        id: '103',
        title: '백색 기억',
        category: 'Limited Edition',
        image:
          'https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?auto=format&fit=crop&w=1200&q=80',
        type: 'exhibition',
      },
      {
        id: '104',
        title: '시간의 결',
        category: 'Ceramic Object',
        image:
          'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=1200&q=80',
        type: 'available',
        price: 450,
      },
      {
        id: '105',
        title: '표면 아래',
        category: 'Original Artwork',
        image:
          'https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?auto=format&fit=crop&w=1200&q=80',
        type: 'available',
        price: 2200,
      },
      {
        id: '106',
        title: '침묵의 형태',
        category: 'Art Object',
        image:
          'https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=1200&q=80',
        type: 'sold',
      },
    ],
  },
  {
    id: '2',
    name: '유종욱',
    specialty: '조형예술가',
    bio: '말이 건네는 특별한 의미',
    location: '부산, 대한민국',
    image: 'https://flexible.img.hani.co.kr/flexible/normal/970/1098/imgdb/resize/2018/0312/00503574_20180312.JPG',
    studioImage: 'https://i.ytimg.com/vi/5Um6EUq5l7Q/maxresdefault.jpg',
    collectors: 890,
    ipNotice: '유종욱 작가의 상징적 조형 언어가 향후 다양한 아트 굿즈로 확장됩니다.',
    expansionDescription:
      '유종욱 작가는 말이라는 존재를 통해 상징, 이동, 기억, 생명력을 이야기합니다. 조형 작품 속 상징적 실루엣은 향후 피규어, 소형 오브제, 공간 장식 컬렉션으로 이어지며 대중이 보다 가까이 수집할 수 있는 형태로 진화합니다.',
    portfolio: [
      {
        id: '201',
        title: '달리는 의미',
        category: 'Sculpture',
        image:
          'https://images.unsplash.com/photo-1518994603110-4f5c1b2fba28?auto=format&fit=crop&w=1200&q=80',
        type: 'available',
        price: 1350,
      },
      {
        id: '202',
        title: '검은 말',
        category: 'Original Artwork',
        image:
          'https://images.unsplash.com/photo-1545239351-ef35f43d514b?auto=format&fit=crop&w=1200&q=80',
        type: 'exhibition',
      },
      {
        id: '203',
        title: '침묵의 질주',
        category: 'Limited Edition',
        image:
          'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=1200&q=80',
        type: 'sold',
      },
      {
        id: '204',
        title: '여백의 힘',
        category: 'Art Object',
        image:
          'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1200&q=80',
        type: 'available',
        price: 520,
      },
      {
        id: '205',
        title: '말의 기억',
        category: 'Sculpture',
        image:
          'https://images.unsplash.com/photo-1518544801976-3e159e50e5bb?auto=format&fit=crop&w=1200&q=80',
        type: 'available',
        price: 870,
      },
      {
        id: '206',
        title: '초원의 상징',
        category: 'Exhibition Piece',
        image:
          'https://images.unsplash.com/photo-1518991104122-2bea6b1c3f0d?auto=format&fit=crop&w=1200&q=80',
        type: 'exhibition',
      },
    ],
  },
  {
    id: '3',
    name: '김원근',
    specialty: '조각가',
    bio: '팬들 나에게 영감을 주는 뮤즈',
    location: '경기, 대한민국',
    image: 'https://img.hankyung.com/photo/202307/01.34055841.1.jpg',
    studioImage:
      'https://th.bing.com/th/id/R.d80d3be1412cf730ae704549da85c1ed?rik=iPsWkRtbCz8hzw&riu=http%3a%2f%2fwww.boeuni.com%2fnews%2fphoto%2f201601%2f42729_22583_148.jpg&ehk=dx%2FuTCGwd4VlSWNYpbmOFxEwtsfBsuVgTiEzAWDl4QY%3d&risl=&pid=ImgRaw&r=0',
    collectors: 2150,
    ipNotice: '김원근 작가의 대표 조각 시리즈는 향후 한정판 컬렉터블로 전개될 예정입니다.',
    expansionDescription:
      '김원근 작가는 인물과 감정의 긴장을 조형적으로 포착하며, 팬들과의 관계에서 얻은 영감을 작업에 녹여냅니다. 그의 대표 시리즈는 원작 조각을 중심으로 프리미엄 레플리카, 에디션 굿즈, 전시 연계 상품으로 확장 가능한 강한 IP 잠재력을 지닙니다.',
    portfolio: [
      {
        id: '301',
        title: '뮤즈의 형상',
        category: 'Sculpture',
        image:
          'https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&w=1200&q=80',
        type: 'available',
        price: 1650,
      },
      {
        id: '302',
        title: '감정의 균형',
        category: 'Original Artwork',
        image:
          'https://images.unsplash.com/photo-1504198458649-3128b932f49b?auto=format&fit=crop&w=1200&q=80',
        type: 'available',
        price: 3100,
      },
      {
        id: '303',
        title: '팬텀 라인',
        category: 'Limited Edition',
        image:
          'https://images.unsplash.com/photo-1529429617124-aee711a5ac1c?auto=format&fit=crop&w=1200&q=80',
        type: 'sold',
      },
      {
        id: '304',
        title: '응시',
        category: 'Sculpture',
        image:
          'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=1200&q=80',
        type: 'available',
        price: 940,
      },
      {
        id: '305',
        title: '내면의 파동',
        category: 'Exhibition Piece',
        image:
          'https://images.unsplash.com/photo-1561214115-f2f134cc4912?auto=format&fit=crop&w=1200&q=80',
        type: 'exhibition',
      },
      {
        id: '306',
        title: '관계의 조각',
        category: 'Art Object',
        image:
          'https://images.unsplash.com/photo-1580137189272-c9379f8864fd?auto=format&fit=crop&w=1200&q=80',
        type: 'available',
        price: 760,
      },
    ],
  },
  {
    id: '4',
    name: '주후식',
    specialty: '조각가',
    bio: '사랑으로 빚어낸 더 큰 사랑',
    location: '전주, 대한민국',
    image: 'https://cdn.womaneconomy.co.kr/news/photo/202008/93053_303230_5124.jpg',
    studioImage: 'https://i.ytimg.com/vi/cuJ2jG13VeQ/maxresdefault.jpg',
    collectors: 670,
    ipNotice: '주후식 작가의 따뜻한 조형 세계는 리빙 오브제와 감성 굿즈로 이어질 예정입니다.',
    expansionDescription:
      '주후식 작가는 사랑과 치유의 정서를 조형 언어로 풀어내며, 대중과 정서적으로 깊게 연결되는 작품 세계를 보여줍니다. 이러한 감성적 서사는 오브제, 라이프스타일 소품, 기념 에디션으로 확장되기에 매우 적합한 강점을 지니고 있습니다.',
    portfolio: [
      {
        id: '401',
        title: '사랑의 곡선',
        category: 'Sculpture',
        image:
          'https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=1200&q=80',
        type: 'available',
        price: 720,
      },
      {
        id: '402',
        title: '포옹',
        category: 'Original Artwork',
        image:
          'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80',
        type: 'sold',
      },
      {
        id: '403',
        title: '따뜻한 형태',
        category: 'Art Object',
        image:
          'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=1200&q=80',
        type: 'available',
        price: 390,
      },
      {
        id: '404',
        title: '온기',
        category: 'Limited Edition',
        image:
          'https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?auto=format&fit=crop&w=1200&q=80',
        type: 'exhibition',
      },
      {
        id: '405',
        title: '사랑의 입자',
        category: 'Sculpture',
        image:
          'https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&w=1200&q=80',
        type: 'available',
        price: 650,
      },
      {
        id: '406',
        title: '더 큰 사랑',
        category: 'Exhibition Piece',
        image:
          'https://images.unsplash.com/photo-1504198458649-3128b932f49b?auto=format&fit=crop&w=1200&q=80',
        type: 'exhibition',
      },
    ],
  },
];
