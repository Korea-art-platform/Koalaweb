import { ImageWithFallback } from "@/app/components/fallback/ImageWithFallback";

export function RichTextRenderer() {
  return (
    <div className="prose prose-lg max-w-none text-gray-700">
      <h2 className="text-2xl font-bold mt-8 mb-4 text-black">작품 소개</h2>
      <p className="text-base leading-[1.8] text-[#374151] mb-6">
        전통 민화에서 영감을 받아 탄생한 한정판 아트토이입니다.<br />
        손으로 직접 채색한 유니크한 작품으로, 전 세계 500개 한정 제작되었습니다.
      </p>

      <hr className="my-8 border-t border-gray-200" />

      <h2 className="text-2xl font-bold mt-8 mb-4 text-black">작품 스펙</h2>
      <div className="overflow-x-auto mb-6">
        <table className="w-full text-left border-collapse border border-gray-200">
          <tbody>
            <tr className="border-b border-gray-200">
              <th className="py-3 px-4 bg-gray-50 font-medium text-gray-900 border-r border-gray-200 w-1/4">소재</th>
              <td className="py-3 px-4 text-gray-700">레진, 핸드페인팅</td>
            </tr>
            <tr className="border-b border-gray-200">
              <th className="py-3 px-4 bg-gray-50 font-medium text-gray-900 border-r border-gray-200">크기</th>
              <td className="py-3 px-4 text-gray-700">15cm × 8cm × 8cm</td>
            </tr>
            <tr className="border-b border-gray-200">
              <th className="py-3 px-4 bg-gray-50 font-medium text-gray-900 border-r border-gray-200">무게</th>
              <td className="py-3 px-4 text-gray-700">300g</td>
            </tr>
            <tr className="border-b border-gray-200">
              <th className="py-3 px-4 bg-gray-50 font-medium text-gray-900 border-r border-gray-200">에디션</th>
              <td className="py-3 px-4 text-gray-700">125 / 500</td>
            </tr>
            <tr>
              <th className="py-3 px-4 bg-gray-50 font-medium text-gray-900 border-r border-gray-200">제작연도</th>
              <td className="py-3 px-4 text-gray-700">2024</td>
            </tr>
          </tbody>
        </table>
      </div>

      <hr className="my-8 border-t border-gray-200" />

      <h2 className="text-2xl font-bold mt-8 mb-4 text-black">패키징</h2>
      <div className="my-6 rounded-xl overflow-hidden">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
          alt="Packaging Box"
          className="w-full h-auto object-cover rounded-xl"
        />
      </div>
      <p className="text-base leading-[1.8] text-[#374151] mb-6">
        고급 아트박스 패키징으로 제공됩니다.<br />
        작가 친필 사인 보증서 포함.
      </p>

      <hr className="my-8 border-t border-gray-200" />

      <h2 className="text-2xl font-bold mt-8 mb-4 text-black">배송 안내</h2>
      <ul className="list-disc list-outside pl-5 space-y-2 text-base leading-[1.8] text-[#374151] mb-6">
        <li>주문 후 3-5 영업일 이내 발송</li>
        <li>전 세계 배송 가능</li>
        <li>파손 방지 에어캡 포장</li>
        <li>반품/교환: 수령 후 7일 이내</li>
      </ul>
    </div>
  );
}