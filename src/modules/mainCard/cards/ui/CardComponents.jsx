import { useEffect, useRef, useState } from "react";
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
    const singleBlockRef = useRef(null);
    const rafRef = useRef(null);
    const scrollPos = useRef(0);
    const [shouldScroll, setShouldScroll] = useState(false);

    useEffect(() => {
        const container = containerRef.current;
        const inner = innerRef.current;
        const singleBlock = singleBlockRef.current;
        if (!container || !singleBlock) return;

        const updateMeasurements = () => {
            const contentHeight = singleBlock.offsetHeight;
            const containerHeight = container.offsetHeight;

            if (contentHeight > containerHeight) {
                setShouldScroll(true);
            } else {
                setShouldScroll(false);
                scrollPos.current = 0;
                if (inner) inner.style.transform = 'translateY(0)';
            }
        };

        updateMeasurements();
        const resizeObserver = new ResizeObserver(updateMeasurements);
        resizeObserver.observe(singleBlock);
        resizeObserver.observe(container);

        return () => resizeObserver.disconnect();
    }, [children, scrollKey]);

    useEffect(() => {
        if (!shouldScroll) return;

        const container = containerRef.current;
        const inner = innerRef.current;
        const singleBlock = singleBlockRef.current;
        if (!container || !inner || !singleBlock) return;

        let loopHeight = singleBlock.offsetHeight;
        let speed = loopHeight / (interval * 1000 * speedFactor);

        let lastTime = performance.now();
        const loop = (now) => {
            const delta = now - lastTime;
            lastTime = now;

            if (loopHeight > 0 && speed > 0) {
                scrollPos.current += speed * delta;
                if (scrollPos.current >= loopHeight) {
                    scrollPos.current -= loopHeight;
                }
                inner.style.transform = `translateY(-${scrollPos.current}px)`;
            }
            rafRef.current = requestAnimationFrame(loop);
        };

        rafRef.current = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(rafRef.current);
    }, [shouldScroll, interval, speedFactor, children]);

    return (
        <Box
            ref={containerRef}
            sx={{
                maxHeight: '58vh',
                overflow: 'hidden',
                position: 'relative',
            }}
        >
            <Box
                ref={innerRef}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    willChange: 'transform'
                }}
            >
                <Box ref={singleBlockRef} key="block-1">{children}</Box>
                {shouldScroll && <Box key="block-2">{children}</Box>}
            </Box>
        </Box>
    );
};

export const GenericCard = ({ id, title, icon: IconComponent, content, interval, speedFactor }) => {
    return (
        <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ textAlign: 'center', mb: 1, flexShrink: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1 }}>
                    <IconComponent style={{ width: '24px', height: '24px', color: '#bca886' }} />
                </Box>
                <Typography sx={{ color: '#8b7355', fontSize: '1.25rem', fontWeight: 600 }}>
                    {title}
                </Typography>
            </Box>

            <Box sx={{ flex: 1, minHeight: 0 }}>
                <ScrollingContent
                    interval={interval}
                    scrollKey={id}
                    speedFactor={speedFactor}
                >
                    {content}
                </ScrollingContent>
            </Box>
        </Box>
    );
};