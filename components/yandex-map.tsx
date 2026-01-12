"use client";

export function YandexMap() {
    return (
        <div className="w-full h-[400px] rounded-lg overflow-hidden shadow-lg">
            <iframe
                src="https://yandex.uz/map-widget/v1/?ll=69.279737%2C41.326418&z=17&l=map&pt=69.279737,41.326418,pm2rdm"
                width="100%"
                height="400"
                frameBorder="0"
                allowFullScreen
                style={{ position: "relative" }}
                title="Yandex Map - г.Ташкент, Шайхонтохурский район, ул.Алишера Навои, дом 16А"
            />
        </div>
    );
}
