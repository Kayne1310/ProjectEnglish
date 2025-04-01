import { useEffect, useState } from "react";

const CountDown = ({ onTimeUpdate }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCount(prevCount => {
                const newCount = prevCount + 1;
                // Gửi thời gian hiện tại lên component cha
                if (onTimeUpdate) {
                    onTimeUpdate(newCount);
                }
                return newCount;
            });
        }, 1000);

        return () => {
            clearInterval(timer);
        }
    }, [onTimeUpdate]);

    const toHHMMSS = (secs) => {
        var sec_num = parseInt(secs, 10)
        var hours = Math.floor(sec_num / 3600)
        var minutes = Math.floor(sec_num / 60) % 60
        var seconds = sec_num % 60

        return [hours, minutes, seconds]
            .map(v => v < 10 ? "0" + v : v)
            .filter((v, i) => v !== "00" || i > 0)
            .join(":")
    }

    return (
        <div className="countdown-container">
            {toHHMMSS(count)}
        </div>
    )
}

export default CountDown;