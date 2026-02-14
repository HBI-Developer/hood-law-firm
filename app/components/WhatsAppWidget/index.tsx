import { Icon } from "@iconify/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Button,
  Dialog,
  DialogTrigger,
  Heading,
  Modal,
  ModalOverlay,
  TextArea,
} from "react-aria-components";
import { PHONE_NUMBER } from "~/constants";

export default function WhatsAppWidget() {
  const { t, i18n } = useTranslation();
  const [message, setMessage] = useState("");
  const waLink = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(message)}`;

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col items-end gap-4 pointer-events-none">
      <DialogTrigger>
        <Button className="pointer-events-auto w-14 h-14 bg-green-500 text-white rounded-full flex items-center justify-center shadow-2xl hover:bg-green-600 hover:scale-110 transition-all duration-300 group outline-none focus:ring-4 focus:ring-green-400/50">
          <Icon icon="logos:whatsapp-icon" className="w-8 h-8" />
          <span className="absolute -top-12 left-0 bg-white text-stone-800 px-3 py-1.5 rounded-xl text-sm font-bold shadow-xl opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all whitespace-nowrap border border-stone-100 pointer-events-none">
            {t("whatsapp.title")}
          </span>
        </Button>

        <ModalOverlay className="fixed inset-0 z-60 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 pointer-events-auto">
          <Modal className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300">
            <Dialog className="outline-none">
              {({ close }) => (
                <div className="flex flex-col h-full max-h-[90vh]">
                  {/* Header */}
                  <div className="bg-green-600 p-6 text-white flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white/20 rounded-full">
                        <Icon
                          icon="logos:whatsapp-icon"
                          className="w-6 h-6 brightness-0 invert"
                        />
                      </div>
                      <div>
                        <Heading
                          slot="title"
                          className="text-xl font-bold font-primary"
                        >
                          {t("whatsapp.title")}
                        </Heading>
                        <p className="text-sm opacity-80 font-secondary">
                          {t("whatsapp.online")}
                        </p>
                      </div>
                    </div>
                    <Button
                      onPress={close}
                      className="p-2 hover:bg-white/10 rounded-full transition-colors outline-none"
                    >
                      <Icon icon="lucide:x" className="w-6 h-6" />
                    </Button>
                  </div>

                  <div className="p-6 space-y-6 overflow-y-auto">
                    {/* QR Code Section */}
                    <div className="flex flex-col items-center gap-4 bg-stone-50 p-6 rounded-2xl border border-stone-100">
                      <div className="bg-white p-3 rounded-xl shadow-inner border border-stone-100">
                        <img
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://wa.me/${PHONE_NUMBER.replaceAll(" ", "")}`}
                          alt="WhatsApp QR Code"
                          className="w-36 h-36"
                        />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-secondary text-stone-500 mb-1">
                          {t("whatsapp.qr_label")}
                        </p>
                        <p
                          className="text-lg font-bold text-stone-800 font-secondary tracking-wider"
                          dir="ltr"
                        >
                          +{PHONE_NUMBER}
                        </p>
                      </div>
                    </div>

                    {/* Chat Area */}
                    <div className="space-y-3">
                      <TextArea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder={t("whatsapp.placeholder")}
                        className="w-full min-h-25 p-4 bg-stone-50 border border-stone-200 rounded-2xl font-secondary focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all resize-none"
                      />
                      <Button
                        onPress={() => {
                          window.open(waLink, "_blank");
                          close();
                        }}
                        className="w-full py-4 bg-green-600 text-white rounded-2xl font-bold font-secondary flex items-center justify-center gap-2 hover:bg-green-700 transition-all shadow-lg shadow-green-600/20"
                      >
                        <Icon
                          icon="lucide:send"
                          className={`w-5 h-5 ${i18n.language === "ar" ? "rotate-180" : ""}`}
                        />
                        {t("whatsapp.send")}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </Dialog>
          </Modal>
        </ModalOverlay>
      </DialogTrigger>
    </div>
  );
}
