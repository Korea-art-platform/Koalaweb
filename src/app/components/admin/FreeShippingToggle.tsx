interface Props {
  checked: boolean;
  onChange: (next: boolean) => void;
}

export default function FreeShippingToggle({ checked, onChange }: Props) {
  return (
    <div className="flex items-center justify-between gap-4 border border-gray-100 rounded-lg px-4 py-3">
      <div className="min-w-0">
        <p className="text-xs font-semibold text-gray-700">배송비 면제</p>
        <p className="mt-0.5 text-[11px] leading-relaxed text-gray-400 break-keep">
          결제 테스트 등에 씁니다. 주문에 담긴 상품이 모두 면제일 때만 배송비가 0원이 됩니다.
        </p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label="배송비 면제"
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-koala-purple/40 ${
          checked ? 'bg-koala-purple' : 'bg-gray-200'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
            checked ? 'translate-x-5' : ''
          }`}
        />
      </button>
    </div>
  );
}
