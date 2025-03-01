// import { 
//     BackgroundBeams, 
//     BackgroundGradient, 
//     BentoGrid, 
//     BentoGridItem,
//     TextGenerateEffect,
//     StickyScroll,
//     SparklesCore,
//     AnimatedTooltip,
//     Meteors,
//     InfiniteMovingCards,
//     HoverBorderGradient,
//     LampContainer,
//     Lamp,
//     Spotlight,
//     TracingBeam
//   } from "@/components/ui/aceternity"

"use client";

import { cn } from "@/lib/utils";
import { motion, stagger, useAnimate } from "framer-motion";
import React, { useId, useMemo } from "react";
import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { useAnimation } from "framer-motion";


export const BackgroundBeams = React.memo(({
  className
}) => {
  const paths = [
    "M-380 -189C-380 -189 -312 216 152 343C616 470 684 875 684 875",
    "M-373 -197C-373 -197 -305 208 159 335C623 462 691 867 691 867",
    "M-366 -205C-366 -205 -298 200 166 327C630 454 698 859 698 859",
    "M-359 -213C-359 -213 -291 192 173 319C637 446 705 851 705 851",
    "M-352 -221C-352 -221 -284 184 180 311C644 438 712 843 712 843",
    "M-345 -229C-345 -229 -277 176 187 303C651 430 719 835 719 835",
    "M-338 -237C-338 -237 -270 168 194 295C658 422 726 827 726 827",
    "M-331 -245C-331 -245 -263 160 201 287C665 414 733 819 733 819",
    "M-324 -253C-324 -253 -256 152 208 279C672 406 740 811 740 811",
    "M-317 -261C-317 -261 -249 144 215 271C679 398 747 803 747 803",
    "M-310 -269C-310 -269 -242 136 222 263C686 390 754 795 754 795",
    "M-303 -277C-303 -277 -235 128 229 255C693 382 761 787 761 787",
    "M-296 -285C-296 -285 -228 120 236 247C700 374 768 779 768 779",
    "M-289 -293C-289 -293 -221 112 243 239C707 366 775 771 775 771",
    "M-282 -301C-282 -301 -214 104 250 231C714 358 782 763 782 763",
    "M-275 -309C-275 -309 -207 96 257 223C721 350 789 755 789 755",
    "M-268 -317C-268 -317 -200 88 264 215C728 342 796 747 796 747",
    "M-261 -325C-261 -325 -193 80 271 207C735 334 803 739 803 739",
    "M-254 -333C-254 -333 -186 72 278 199C742 326 810 731 810 731",
    "M-247 -341C-247 -341 -179 64 285 191C749 318 817 723 817 723",
    "M-240 -349C-240 -349 -172 56 292 183C756 310 824 715 824 715",
    "M-233 -357C-233 -357 -165 48 299 175C763 302 831 707 831 707",
    "M-226 -365C-226 -365 -158 40 306 167C770 294 838 699 838 699",
    "M-219 -373C-219 -373 -151 32 313 159C777 286 845 691 845 691",
    "M-212 -381C-212 -381 -144 24 320 151C784 278 852 683 852 683",
    "M-205 -389C-205 -389 -137 16 327 143C791 270 859 675 859 675",
    "M-198 -397C-198 -397 -130 8 334 135C798 262 866 667 866 667",
    "M-191 -405C-191 -405 -123 0 341 127C805 254 873 659 873 659",
    "M-184 -413C-184 -413 -116 -8 348 119C812 246 880 651 880 651",
    "M-177 -421C-177 -421 -109 -16 355 111C819 238 887 643 887 643",
    "M-170 -429C-170 -429 -102 -24 362 103C826 230 894 635 894 635",
    "M-163 -437C-163 -437 -95 -32 369 95C833 222 901 627 901 627",
    "M-156 -445C-156 -445 -88 -40 376 87C840 214 908 619 908 619",
    "M-149 -453C-149 -453 -81 -48 383 79C847 206 915 611 915 611",
    "M-142 -461C-142 -461 -74 -56 390 71C854 198 922 603 922 603",
    "M-135 -469C-135 -469 -67 -64 397 63C861 190 929 595 929 595",
    "M-128 -477C-128 -477 -60 -72 404 55C868 182 936 587 936 587",
    "M-121 -485C-121 -485 -53 -80 411 47C875 174 943 579 943 579",
    "M-114 -493C-114 -493 -46 -88 418 39C882 166 950 571 950 571",
    "M-107 -501C-107 -501 -39 -96 425 31C889 158 957 563 957 563",
    "M-100 -509C-100 -509 -32 -104 432 23C896 150 964 555 964 555",
    "M-93 -517C-93 -517 -25 -112 439 15C903 142 971 547 971 547",
    "M-86 -525C-86 -525 -18 -120 446 7C910 134 978 539 978 539",
    "M-79 -533C-79 -533 -11 -128 453 -1C917 126 985 531 985 531",
    "M-72 -541C-72 -541 -4 -136 460 -9C924 118 992 523 992 523",
    "M-65 -549C-65 -549 3 -144 467 -17C931 110 999 515 999 515",
    "M-58 -557C-58 -557 10 -152 474 -25C938 102 1006 507 1006 507",
    "M-51 -565C-51 -565 17 -160 481 -33C945 94 1013 499 1013 499",
    "M-44 -573C-44 -573 24 -168 488 -41C952 86 1020 491 1020 491",
    "M-37 -581C-37 -581 31 -176 495 -49C959 78 1027 483 1027 483",
  ];
  return (
    (<div
      className={cn(
        "absolute  h-full w-full inset-0  [mask-size:40px] [mask-repeat:no-repeat] flex items-center justify-center",
        className
      )}>
      <svg
        className=" z-0 h-full w-full pointer-events-none absolute "
        width="100%"
        height="100%"
        viewBox="0 0 696 316"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path
          d="M-380 -189C-380 -189 -312 216 152 343C616 470 684 875 684 875M-373 -197C-373 -197 -305 208 159 335C623 462 691 867 691 867M-366 -205C-366 -205 -298 200 166 327C630 454 698 859 698 859M-359 -213C-359 -213 -291 192 173 319C637 446 705 851 705 851M-352 -221C-352 -221 -284 184 180 311C644 438 712 843 712 843M-345 -229C-345 -229 -277 176 187 303C651 430 719 835 719 835M-338 -237C-338 -237 -270 168 194 295C658 422 726 827 726 827M-331 -245C-331 -245 -263 160 201 287C665 414 733 819 733 819M-324 -253C-324 -253 -256 152 208 279C672 406 740 811 740 811M-317 -261C-317 -261 -249 144 215 271C679 398 747 803 747 803M-310 -269C-310 -269 -242 136 222 263C686 390 754 795 754 795M-303 -277C-303 -277 -235 128 229 255C693 382 761 787 761 787M-296 -285C-296 -285 -228 120 236 247C700 374 768 779 768 779M-289 -293C-289 -293 -221 112 243 239C707 366 775 771 775 771M-282 -301C-282 -301 -214 104 250 231C714 358 782 763 782 763M-275 -309C-275 -309 -207 96 257 223C721 350 789 755 789 755M-268 -317C-268 -317 -200 88 264 215C728 342 796 747 796 747M-261 -325C-261 -325 -193 80 271 207C735 334 803 739 803 739M-254 -333C-254 -333 -186 72 278 199C742 326 810 731 810 731M-247 -341C-247 -341 -179 64 285 191C749 318 817 723 817 723M-240 -349C-240 -349 -172 56 292 183C756 310 824 715 824 715M-233 -357C-233 -357 -165 48 299 175C763 302 831 707 831 707M-226 -365C-226 -365 -158 40 306 167C770 294 838 699 838 699M-219 -373C-219 -373 -151 32 313 159C777 286 845 691 845 691M-212 -381C-212 -381 -144 24 320 151C784 278 852 683 852 683M-205 -389C-205 -389 -137 16 327 143C791 270 859 675 859 675M-198 -397C-198 -397 -130 8 334 135C798 262 866 667 866 667M-191 -405C-191 -405 -123 0 341 127C805 254 873 659 873 659M-184 -413C-184 -413 -116 -8 348 119C812 246 880 651 880 651M-177 -421C-177 -421 -109 -16 355 111C819 238 887 643 887 643M-170 -429C-170 -429 -102 -24 362 103C826 230 894 635 894 635M-163 -437C-163 -437 -95 -32 369 95C833 222 901 627 901 627M-156 -445C-156 -445 -88 -40 376 87C840 214 908 619 908 619M-149 -453C-149 -453 -81 -48 383 79C847 206 915 611 915 611M-142 -461C-142 -461 -74 -56 390 71C854 198 922 603 922 603M-135 -469C-135 -469 -67 -64 397 63C861 190 929 595 929 595M-128 -477C-128 -477 -60 -72 404 55C868 182 936 587 936 587M-121 -485C-121 -485 -53 -80 411 47C875 174 943 579 943 579M-114 -493C-114 -493 -46 -88 418 39C882 166 950 571 950 571M-107 -501C-107 -501 -39 -96 425 31C889 158 957 563 957 563M-100 -509C-100 -509 -32 -104 432 23C896 150 964 555 964 555M-93 -517C-93 -517 -25 -112 439 15C903 142 971 547 971 547M-86 -525C-86 -525 -18 -120 446 7C910 134 978 539 978 539M-79 -533C-79 -533 -11 -128 453 -1C917 126 985 531 985 531M-72 -541C-72 -541 -4 -136 460 -9C924 118 992 523 992 523M-65 -549C-65 -549 3 -144 467 -17C931 110 999 515 999 515M-58 -557C-58 -557 10 -152 474 -25C938 102 1006 507 1006 507M-51 -565C-51 -565 17 -160 481 -33C945 94 1013 499 1013 499M-44 -573C-44 -573 24 -168 488 -41C952 86 1020 491 1020 491M-37 -581C-37 -581 31 -176 495 -49C959 78 1027 483 1027 483M-30 -589C-30 -589 38 -184 502 -57C966 70 1034 475 1034 475M-23 -597C-23 -597 45 -192 509 -65C973 62 1041 467 1041 467M-16 -605C-16 -605 52 -200 516 -73C980 54 1048 459 1048 459M-9 -613C-9 -613 59 -208 523 -81C987 46 1055 451 1055 451M-2 -621C-2 -621 66 -216 530 -89C994 38 1062 443 1062 443M5 -629C5 -629 73 -224 537 -97C1001 30 1069 435 1069 435M12 -637C12 -637 80 -232 544 -105C1008 22 1076 427 1076 427M19 -645C19 -645 87 -240 551 -113C1015 14 1083 419 1083 419"
          stroke="url(#paint0_radial_242_278)"
          strokeOpacity="0.05"
          strokeWidth="0.5"></path>

        {paths.map((path, index) => (
          <motion.path
            key={`path-` + index}
            d={path}
            stroke={`url(#linearGradient-${index})`}
            strokeOpacity="0.4"
            strokeWidth="0.5"></motion.path>
        ))}
        <defs>
          {paths.map((path, index) => (
            <motion.linearGradient
              id={`linearGradient-${index}`}
              key={`gradient-${index}`}
              initial={{
                x1: "0%",
                x2: "0%",
                y1: "0%",
                y2: "0%",
              }}
              animate={{
                x1: ["0%", "100%"],
                x2: ["0%", "95%"],
                y1: ["0%", "100%"],
                y2: ["0%", `${93 + Math.random() * 8}%`],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                ease: "easeInOut",
                repeat: Infinity,
                delay: Math.random() * 10,
              }}>
              <stop stopColor="#18CCFC" stopOpacity="0"></stop>
              <stop stopColor="#18CCFC"></stop>
              <stop offset="32.5%" stopColor="#6344F5"></stop>
              <stop offset="100%" stopColor="#AE48FF" stopOpacity="0"></stop>
            </motion.linearGradient>
          ))}

          <radialGradient
            id="paint0_radial_242_278"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(352 34) rotate(90) scale(555 1560.62)">
            <stop offset="0.0666667" stopColor="var(--neutral-300)"></stop>
            <stop offset="0.243243" stopColor="var(--neutral-300)"></stop>
            <stop offset="0.43594" stopColor="white" stopOpacity="0"></stop>
          </radialGradient>
        </defs>
      </svg>
    </div>)
  );
});

BackgroundBeams.displayName = "BackgroundBeams";


export const TextGenerateEffect = ({
    words,
    className,
    filter = true,
    duration = 0.5,
  }) => {
    const [scope, animate] = useAnimate();
    let wordsArray = words.split(" ");
    useEffect(() => {
      animate(
        "span",
        {
          opacity: 1,
          filter: filter ? "blur(0px)" : "none",
        },
        {
          duration: duration ? duration : 1,
          delay: stagger(0.2),
        }
      );
    }, [scope.current]);
   
    const renderWords = () => {
      return (
        <motion.div ref={scope}>
          {wordsArray.map((word, idx) => {
            return (
              <motion.span
                key={word + idx}
                className="dark:text-white text-black opacity-0"
                style={{
                  filter: filter ? "blur(10px)" : "none",
                }}
              >
                {word}{" "}
              </motion.span>
            );
          })}
        </motion.div>
      );
    };
   
    return (
      <div className={cn("font-bold", className)}>
        <div className="mt-4">
          <div className=" dark:text-white text-black text-2xl leading-snug tracking-wide">
            {renderWords()}
          </div>
        </div>
      </div>
    );
  };


  export const BackgroundGradient = ({
    children,
    className,
    containerClassName,
    animate = true,
  }) => {
    const variants = {
      initial: {
        backgroundPosition: "0 50%",
      },
      animate: {
        backgroundPosition: ["0, 50%", "100% 50%", "0 50%"],
      },
    };
    return (
      <div className={cn("relative p-[4px] group", containerClassName)}>
        <motion.div
          variants={animate ? variants : undefined}
          initial={animate ? "initial" : undefined}
          animate={animate ? "animate" : undefined}
          transition={
            animate
              ? {
                  duration: 5,
                  repeat: Infinity,
                  repeatType: "reverse",
                }
              : undefined
          }
          style={{
            backgroundSize: animate ? "400% 400%" : undefined,
          }}
          className={cn(
            "absolute inset-0 rounded-3xl z-[1] opacity-60 group-hover:opacity-100 blur-xl  transition duration-500 will-change-transform",
            " bg-[radial-gradient(circle_farthest-side_at_0_100%,#00ccb1,transparent),radial-gradient(circle_farthest-side_at_100%_0,#7b61ff,transparent),radial-gradient(circle_farthest-side_at_100%_100%,#ffc414,transparent),radial-gradient(circle_farthest-side_at_0_0,#1ca0fb,#141316)]"
          )}
        />
        <motion.div
          variants={animate ? variants : undefined}
          initial={animate ? "initial" : undefined}
          animate={animate ? "animate" : undefined}
          transition={
            animate
              ? {
                  duration: 5,
                  repeat: Infinity,
                  repeatType: "reverse",
                }
              : undefined
          }
          style={{
            backgroundSize: animate ? "400% 400%" : undefined,
          }}
          className={cn(
            "absolute inset-0 rounded-3xl z-[1] will-change-transform",
            "bg-[radial-gradient(circle_farthest-side_at_0_100%,#00ccb1,transparent),radial-gradient(circle_farthest-side_at_100%_0,#7b61ff,transparent),radial-gradient(circle_farthest-side_at_100%_100%,#ffc414,transparent),radial-gradient(circle_farthest-side_at_0_0,#1ca0fb,#141316)]"
          )}
        />
   
        <div className={cn("relative z-10", className)}>{children}</div>
      </div>
    );
  };

  
  export const SparklesCore = (props) => {
    const {
      id,
      className,
      background,
      minSize,
      maxSize,
      speed,
      particleColor,
      particleDensity,
    } = props;
    const [init, setInit] = useState(false);
    useEffect(() => {
      initParticlesEngine(async (engine) => {
        await loadSlim(engine);
      }).then(() => {
        setInit(true);
      });
    }, []);
    const controls = useAnimation();
   
    const particlesLoaded = async (container) => {
      if (container) {
        controls.start({
          opacity: 1,
          transition: {
            duration: 1,
          },
        });
      }
    };
   
    const generatedId = useId();
    return (
      <motion.div animate={controls} className={cn("opacity-0", className)}>
        {init && (
          <Particles
            id={id || generatedId}
            className={cn("h-full w-full")}
            particlesLoaded={particlesLoaded}
            options={{
              background: {
                color: {
                  value: background || "#0d47a1",
                },
              },
              fullScreen: {
                enable: false,
                zIndex: 1,
              },
   
              fpsLimit: 120,
              interactivity: {
                events: {
                  onClick: {
                    enable: true,
                    mode: "push",
                  },
                  onHover: {
                    enable: false,
                    mode: "repulse",
                  },
                  resize: true ,
                },
                modes: {
                  push: {
                    quantity: 4,
                  },
                  repulse: {
                    distance: 200,
                    duration: 0.4,
                  },
                },
              },
              particles: {
                bounce: {
                  horizontal: {
                    value: 1,
                  },
                  vertical: {
                    value: 1,
                  },
                },
                collisions: {
                  absorb: {
                    speed: 2,
                  },
                  bounce: {
                    horizontal: {
                      value: 1,
                    },
                    vertical: {
                      value: 1,
                    },
                  },
                  enable: false,
                  maxSpeed: 50,
                  mode: "bounce",
                  overlap: {
                    enable: true,
                    retries: 0,
                  },
                },
                color: {
                  value: particleColor || "#ffffff",
                  animation: {
                    h: {
                      count: 0,
                      enable: false,
                      speed: 1,
                      decay: 0,
                      delay: 0,
                      sync: true,
                      offset: 0,
                    },
                    s: {
                      count: 0,
                      enable: false,
                      speed: 1,
                      decay: 0,
                      delay: 0,
                      sync: true,
                      offset: 0,
                    },
                    l: {
                      count: 0,
                      enable: false,
                      speed: 1,
                      decay: 0,
                      delay: 0,
                      sync: true,
                      offset: 0,
                    },
                  },
                },
                effect: {
                  close: true,
                  fill: true,
                  options: {},
                },
                groups: {},
                move: {
                  angle: {
                    offset: 0,
                    value: 90,
                  },
                  attract: {
                    distance: 200,
                    enable: false,
                    rotate: {
                      x: 3000,
                      y: 3000,
                    },
                  },
                  center: {
                    x: 50,
                    y: 50,
                    mode: "percent",
                    radius: 0,
                  },
                  decay: 0,
                  distance: {},
                  direction: "none",
                  drift: 0,
                  enable: true,
                  gravity: {
                    acceleration: 9.81,
                    enable: false,
                    inverse: false,
                    maxSpeed: 50,
                  },
                  path: {
                    clamp: true,
                    delay: {
                      value: 0,
                    },
                    enable: false,
                    options: {},
                  },
                  outModes: {
                    default: "out",
                  },
                  random: false,
                  size: false,
                  speed: {
                    min: 0.1,
                    max: 1,
                  },
                  spin: {
                    acceleration: 0,
                    enable: false,
                  },
                  straight: false,
                  trail: {
                    enable: false,
                    length: 10,
                    fill: {},
                  },
                  vibrate: false,
                  warp: false,
                },
                number: {
                  density: {
                    enable: true,
                    width: 400,
                    height: 400,
                  },
                  limit: {
                    mode: "delete",
                    value: 0,
                  },
                  value: particleDensity || 120,
                },
                opacity: {
                  value: {
                    min: 0.1,
                    max: 1,
                  },
                  animation: {
                    count: 0,
                    enable: true,
                    speed: speed || 4,
                    decay: 0,
                    delay: 0,
                    sync: false,
                    mode: "auto",
                    startValue: "random",
                    destroy: "none",
                  },
                },
                reduceDuplicates: false,
                shadow: {
                  blur: 0,
                  color: {
                    value: "#000",
                  },
                  enable: false,
                  offset: {
                    x: 0,
                    y: 0,
                  },
                },
                shape: {
                  close: true,
                  fill: true,
                  options: {},
                  type: "circle",
                },
                size: {
                  value: {
                    min: minSize || 1,
                    max: maxSize || 3,
                  },
                  animation: {
                    count: 0,
                    enable: false,
                    speed: 5,
                    decay: 0,
                    delay: 0,
                    sync: false,
                    mode: "auto",
                    startValue: "random",
                    destroy: "none",
                  },
                },
                stroke: {
                  width: 0,
                },
                zIndex: {
                  value: 0,
                  opacityRate: 1,
                  sizeRate: 1,
                  velocityRate: 1,
                },
                destroy: {
                  bounds: {},
                  mode: "none",
                  split: {
                    count: 1,
                    factor: {
                      value: 3,
                    },
                    rate: {
                      value: {
                        min: 4,
                        max: 9,
                      },
                    },
                    sizeOffset: true,
                  },
                },
                roll: {
                  darken: {
                    enable: false,
                    value: 0,
                  },
                  enable: false,
                  enlighten: {
                    enable: false,
                    value: 0,
                  },
                  mode: "vertical",
                  speed: 25,
                },
                tilt: {
                  value: 0,
                  animation: {
                    enable: false,
                    speed: 0,
                    decay: 0,
                    sync: false,
                  },
                  direction: "clockwise",
                  enable: false,
                },
                twinkle: {
                  lines: {
                    enable: false,
                    frequency: 0.05,
                    opacity: 1,
                  },
                  particles: {
                    enable: false,
                    frequency: 0.05,
                    opacity: 1,
                  },
                },
                wobble: {
                  distance: 5,
                  enable: false,
                  speed: {
                    angle: 50,
                    move: 10,
                  },
                },
                life: {
                  count: 0,
                  delay: {
                    value: 0,
                    sync: false,
                  },
                  duration: {
                    value: 0,
                    sync: false,
                  },
                },
                rotate: {
                  value: 0,
                  animation: {
                    enable: false,
                    speed: 0,
                    decay: 0,
                    sync: false,
                  },
                  direction: "clockwise",
                  path: false,
                },
                orbit: {
                  animation: {
                    count: 0,
                    enable: false,
                    speed: 1,
                    decay: 0,
                    delay: 0,
                    sync: false,
                  },
                  enable: false,
                  opacity: 1,
                  rotation: {
                    value: 45,
                  },
                  width: 1,
                },
                links: {
                  blink: false,
                  color: {
                    value: "#fff",
                  },
                  consent: false,
                  distance: 100,
                  enable: false,
                  frequency: 1,
                  opacity: 1,
                  shadow: {
                    blur: 5,
                    color: {
                      value: "#000",
                    },
                    enable: false,
                  },
                  triangles: {
                    enable: false,
                    frequency: 1,
                  },
                  width: 1,
                  warp: false,
                },
                repulse: {
                  value: 0,
                  enabled: false,
                  distance: 1,
                  duration: 1,
                  factor: 1,
                  speed: 1,
                },
              },
              detectRetina: true,
            }}
          />
        )}
      </motion.div>
    );
  };


  export function LampDemo() {
    return (
      <LampContainer>
        <motion.h1
          initial={{ opacity: 0.5, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="mt-8 bg-gradient-to-br from-slate-300 to-slate-500 py-4 bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl"
        >
          Build lamps <br /> the right way
        </motion.h1>
      </LampContainer>
    );
  }
   
  export const LampContainer = ({
    children,
    className,
  }) => {
    return (
      <div
        className={cn(
          "relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-slate-950 w-full rounded-md z-0",
          className
        )}
      >
        <div className="relative flex w-full flex-1 scale-y-125 items-center justify-center isolate z-0 ">
          <motion.div
            initial={{ opacity: 0.5, width: "15rem" }}
            whileInView={{ opacity: 1, width: "30rem" }}
            transition={{
              delay: 0.3,
              duration: 0.8,
              ease: "easeInOut",
            }}
            style={{
              backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
            }}
            className="absolute inset-auto right-1/2 h-56 overflow-visible w-[30rem] bg-gradient-conic from-cyan-500 via-transparent to-transparent text-white [--conic-position:from_70deg_at_center_top]"
          >
            <div className="absolute  w-[100%] left-0 bg-slate-950 h-40 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" />
            <div className="absolute  w-40 h-[100%] left-0 bg-slate-950  bottom-0 z-20 [mask-image:linear-gradient(to_right,white,transparent)]" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0.5, width: "15rem" }}
            whileInView={{ opacity: 1, width: "30rem" }}
            transition={{
              delay: 0.3,
              duration: 0.8,
              ease: "easeInOut",
            }}
            style={{
              backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
            }}
            className="absolute inset-auto left-1/2 h-56 w-[30rem] bg-gradient-conic from-transparent via-transparent to-cyan-500 text-white [--conic-position:from_290deg_at_center_top]"
          >
            <div className="absolute  w-40 h-[100%] right-0 bg-slate-950  bottom-0 z-20 [mask-image:linear-gradient(to_left,white,transparent)]" />
            <div className="absolute  w-[100%] right-0 bg-slate-950 h-40 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" />
          </motion.div>
          <div className="absolute top-1/2 h-48 w-full translate-y-12 scale-x-150 bg-slate-950 blur-2xl"></div>
          <div className="absolute top-1/2 z-50 h-48 w-full bg-transparent opacity-10 backdrop-blur-md"></div>
          <div className="absolute inset-auto z-50 h-36 w-[28rem] -translate-y-1/2 rounded-full bg-cyan-500 opacity-50 blur-3xl"></div>
          <motion.div
            initial={{ width: "8rem" }}
            whileInView={{ width: "16rem" }}
            transition={{
              delay: 0.3,
              duration: 0.8,
              ease: "easeInOut",
            }}
            className="absolute inset-auto z-30 h-36 w-64 -translate-y-[6rem] rounded-full bg-cyan-400 blur-2xl"
          ></motion.div>
          <motion.div
            initial={{ width: "15rem" }}
            whileInView={{ width: "30rem" }}
            transition={{
              delay: 0.3,
              duration: 0.8,
              ease: "easeInOut",
            }}
            className="absolute inset-auto z-50 h-0.5 w-[30rem] -translate-y-[7rem] bg-cyan-400 "
          ></motion.div>
   
          <div className="absolute inset-auto z-40 h-44 w-full -translate-y-[12.5rem] bg-slate-950 "></div>
        </div>
   
        <div className="relative z-50 flex -translate-y-80 flex-col items-center px-5">
          {children}
        </div>
      </div>
    );
  };

  export function HoverBorderGradient({
    children,
    containerClassName,
    className,
    as: Tag = "button",
    duration = 1,
    clockwise = true,
    ...props
  }) {
    const [hovered, setHovered] = useState(false);
    const [direction, setDirection] = useState("TOP");
   
    const rotateDirection = (currentDirection) => {
      const directions = ["TOP", "LEFT", "BOTTOM", "RIGHT"];
      const currentIndex = directions.indexOf(currentDirection);
      const nextIndex = clockwise
        ? (currentIndex - 1 + directions.length) % directions.length
        : (currentIndex + 1) % directions.length;
      return directions[nextIndex];
    };
   
    const movingMap = {
      TOP: "radial-gradient(20.7% 50% at 50% 0%, hsl(0, 0%, 100%) 0%, rgba(255, 255, 255, 0) 100%)",
      LEFT: "radial-gradient(16.6% 43.1% at 0% 50%, hsl(0, 0%, 100%) 0%, rgba(255, 255, 255, 0) 100%)",
      BOTTOM:
        "radial-gradient(20.7% 50% at 50% 100%, hsl(0, 0%, 100%) 0%, rgba(255, 255, 255, 0) 100%)",
      RIGHT:
        "radial-gradient(16.2% 41.199999999999996% at 100% 50%, hsl(0, 0%, 100%) 0%, rgba(255, 255, 255, 0) 100%)",
    };
   
    const highlight =
      "radial-gradient(75% 181.15942028985506% at 50% 50%, #3275F8 0%, rgba(255, 255, 255, 0) 100%)";
   
    useEffect(() => {
      if (!hovered) {
        const interval = setInterval(() => {
          setDirection((prevState) => rotateDirection(prevState));
        }, duration * 1000);
        return () => clearInterval(interval);
      }
    }, [hovered]);
    return (
      <Tag
        onMouseEnter={(event) => {
          setHovered(true);
        }}
        onMouseLeave={() => setHovered(false)}
        className={cn(
          "relative flex rounded-full border  content-center bg-black/20 hover:bg-black/10 transition duration-500 dark:bg-white/20 items-center flex-col flex-nowrap gap-10 h-min justify-center overflow-visible p-px  decoration-clone w-full",
          containerClassName
        )}
        {...props}
      >
        <div
          className={cn(
            "w-full  text-white z-10 bg-black px-4 py-2 rounded-[inherit]",
            className
          )}
        >
          {children}
        </div>
        <motion.div
          className={cn(
            "flex-none inset-0 overflow-hidden absolute z-0 rounded-[inherit]"
          )}
          style={{
            filter: "blur(2px)",
            position: "absolute",
            width: "100%",
            height: "100%",
          }}
          initial={{ background: movingMap[direction] }}
          animate={{
            background: hovered
              ? [movingMap[direction], highlight]
              : movingMap[direction],
          }}
          transition={{ ease: "linear", duration: duration ?? 1 }}
        />
        <div className="bg-black absolute z-1 flex-none inset-[2px] rounded-[100px]" />
      </Tag>
    );
  }

  export const Meteors = ({
    number,
    className,
  }) => {
    const meteors = new Array(number || 20).fill(true);
    return (
      <>
        {meteors.map((el, idx) => (
          <span
            key={"meteor" + idx}
            className={cn(
              "animate-meteor-effect absolute top-1/2 left-1/2 h-0.5 w-0.5 rounded-[9999px] bg-slate-500 shadow-[0_0_0_1px_#ffffff10] rotate-[215deg]",
              "before:content-[''] before:absolute before:top-1/2 before:transform before:-translate-y-[50%] before:w-[50px] before:h-[1px] before:bg-gradient-to-r before:from-[#64748b] before:to-transparent",
              className
            )}
            style={{
              top: 0,
              left: Math.floor(Math.random() * (400 - -400) + -400) + "px",
              animationDelay: Math.random() * (0.8 - 0.2) + 0.2 + "s",
              animationDuration: Math.floor(Math.random() * (10 - 2) + 2) + "s",
            }}
          ></span>
        ))}
      </>
    );
  };