const apiKey = process.env.REACT_APP_API_KEY_TWILIO;
const axios = require("axios");

const sendWhatsAppMessage = async (customerPhone, bookingData, ticketNumber) => {
    try {
        const response = await axios.post(
            "https://wasenderapi.com/api/send-message",
            {
                to: `+${customerPhone}`,
                text: bookingData.status !== "canceled" ? `
                        مرحباً ${bookingData.name}! 👋
                        تم حجز المقعد بنجاح ⚡
                        رقم التذكرة: ${ticketNumber}
                        الرحلة: ${bookingData.busNumber || 'لم يتم التحديد بعد'}
                        المسار: ${bookingData.track}
                        اسم المكتب: ${bookingData.OfficeName}
                        التاريخ: ${new Date(bookingData.date).toLocaleDateString()}
                        الوقت: ${bookingData.time}
                        المقعد: ${bookingData.seat || 'لم يتم التحديد بعد'}
                        عدد الشنط: ${bookingData.numberBags}
                        السعر: ${bookingData.price} ريال
                        نتمنى لك رحلة سعيدة ✈️
                        حافلة سهود للنقل البري 😊
                        شكراً لاختيارك خدمتنا! 😊
                ` : `
                        مرحباً ${bookingData.name}! 👋
                        "تم الغاء حجز المقعد"
                        رقم التذكرة: تم الغاء الحجز
                        الرحلة: ${bookingData.busNumber}
                        المسار: ${bookingData.track}
                        اسم المكتب: ${bookingData.OfficeName}
                        التاريخ: ${new Date(bookingData.date).toLocaleDateString()}
                        الوقت: ${bookingData.time}
                        المقعد: ${bookingData.seat || 'لم يتم التحديد بعد'}
                        عدد الشنط: ${bookingData.numberBags}
                        السعر: ${bookingData.price} ريال
                        عود لنا قريبا ✈️
                        حافلة سهود للنقل البري 😊
                        شكراً لاختيارك خدمتنا! 😊
                `,

            },
            {
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    "Content-Type": "application/json",
                },
            }
        );

        console.log("تم إرسال الرسالة بنجاح:", response.data);
    } catch (error) {
        console.error(
            "❌ خطأ في إرسال رسالة واتساب:",
            error.response?.data || error.message
        );
    }
};

module.exports = { sendWhatsAppMessage };
