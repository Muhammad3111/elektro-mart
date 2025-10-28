"use client";

export function YandexMap() {
    return (
        <div className="w-full h-[400px] rounded-lg overflow-hidden shadow-lg">
            <iframe
                src="https://yandex.uz/map-widget/v1/?ll=69.240562%2C41.311151&z=12&l=map"
                width="100%"
                height="400"
                frameBorder="0"
                allowFullScreen
                style={{ position: "relative" }}
                title="Yandex Map"
            />
        </div>
    );
}
