import { CheckCircle2 } from 'lucide-react'

export default function ThankYou({ onClose }) {
  return (
    <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
      <CheckCircle2 className="text-plum" aria-hidden="true" size={56} />
      <h2 className="mt-5 font-display text-2xl font-semibold text-plum">Thank you!</h2>
      <p className="mt-3 max-w-sm text-sm leading-7 text-ink/75">
        Your order message is ready. If you chose an inspiration photo, please attach it in the WhatsApp chat.
      </p>
      <button
        type="button"
        onClick={onClose}
        className="mt-7 min-h-12 rounded-full bg-plum px-6 font-semibold text-white"
      >
        Continue shopping
      </button>
    </div>
  )
}
