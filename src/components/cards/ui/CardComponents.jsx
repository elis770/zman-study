import { useEffect, useRef } from "react";
import { Box, Typography } from "@mui/material";

export const CardItemList = ({ data }) => {
    return (
        <>
            {data.map((item, index) => {
                const IconComponent = item.icon;
                return (
                    <Box
                        key={index}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            p: 2,
                            backgroundColor: 'rgba(255, 255, 255, 0.5)',
                            borderRadius: '8px'
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <IconComponent style={{ width: '20px', height: '20px', color: '#bca886' }} />
                            <Box>
                                <Typography sx={{ color: '#8b7355', fontSize: '0.875rem', fontWeight: 600 }}>
                                    {item.title}
                                </Typography>
                                <Typography className="hebrew-text" sx={{ color: 'rgba(139, 115, 85, 0.6)', fontSize: '0.75rem' }}>
                                    {item.hebrewTitle}
                                </Typography>
                            </Box>
                        </Box>
                        <Typography sx={{ color: '#8b7355', fontSize: '1.25rem', fontWeight: 600 }}>
                            {item.value}
                        </Typography>
                    </Box>
                );
            })}
        </>
    );
};

export const ScrollingContent = ({ children, interval, scrollKey, speedFactor }) => {
    const containerRef = useRef(null);
    const innerRef = useRef(null);
    const rafRef = useRef(null);
    const scrollPos = useRef(0);

    useEffect(() => {
        const container = containerRef.current;
        const inner = innerRef.current;
        if (!container || !inner) return;

        let loopHeight = 0;
        let speed = 0;

        // Function to update measurements
        const updateMeasurements = () => {
            if (!inner) return;

            // The total height is the height of the inner container (which has 2 copies)
            const totalHeight = inner.offsetHeight;
            // The loop height is half of that (height of one copy)
            loopHeight = totalHeight / 2;

            // Calculate speed (px per ms)
            // We want to traverse 1 loopHeight in (interval) seconds * speedFactor
            if (loopHeight > 0 && interval > 0 && speedFactor > 0) {
                speed = loopHeight / (interval * 1000 * speedFactor);
            }
        };

        // Initial measurement
        updateMeasurements();

        const resizeObserver = new ResizeObserver(() => {
            updateMeasurements();
        });

        // Observe the inner content for size changes
        resizeObserver.observe(inner);

        let lastTime = performance.now();

        const loop = (now) => {
            const delta = now - lastTime;
            lastTime = now;

            if (loopHeight > 0 && speed > 0) {
                scrollPos.current += speed * delta;

                // 🔁 Loop logic
                if (scrollPos.current >= loopHeight) {
                    scrollPos.current -= loopHeight;
                }

                // Apply transform
                inner.style.transform = `translateY(-${scrollPos.current}px)`;
            }

            rafRef.current = requestAnimationFrame(loop);
        };

        rafRef.current = requestAnimationFrame(loop);

        return () => {
            cancelAnimationFrame(rafRef.current);
            resizeObserver.disconnect();
        };
    }, [interval, scrollKey, speedFactor, children]);

    return (
        <Box
            ref={containerRef}
            sx={{
                maxHeight: '60vh',
                overflow: 'hidden',
                position: 'relative',
            }}
        >
            <Box
                ref={innerRef}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    willChange: 'transform' // Hardware acceleration hint
                }}
            >
                {/* Blocks wrapped with keys to avoid React warnings */}
                <Box key="block-1">{children}</Box>
                <Box key="block-2">{children}</Box>
            </Box>
        </Box>
    );
};

export const GenericCard = ({ id, title, icon: IconComponent, content, interval, speedFactor }) => {
    return (
        <Box sx={{ p: 4, height: '100%' }}>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 2 }}>
                    <IconComponent style={{ width: '28px', height: '28px', color: '#bca886' }} />
                </Box>
                <Typography sx={{ color: '#8b7355', fontSize: '1.5rem', fontWeight: 600 }}>
                    {title}
                </Typography>
            </Box>

            <ScrollingContent
                interval={interval}
                scrollKey={id}
                speedFactor={speedFactor}
            >
                {content}
            </ScrollingContent>
        </Box>
    );
};
