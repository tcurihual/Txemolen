import { motion } from "motion/react"

const FlameFill = ({ percentage = 50 }) => {
    const height = 100 - percentage

    return (
        <motion.svg
            width="100"
            height="100"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: "backOut" }}
            whileHover={{ scale: 1.05 }}
        >
            <defs>
                <linearGradient
                    id="paint0_linear_53_10"
                    x1="49.8592"
                    y1="100"
                    x2="49.8592"
                    y2="0.0737105"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#FF4C0D" />
                    <stop offset="1" stopColor="#FC9502" />
                </linearGradient>
                <clipPath id="clip0_53_10">
                    <rect width="100" height="100" fill="white" />
                </clipPath>
                <mask id="flameMask">
                    <motion.rect
                        x="0"
                        y={height}
                        width="100"
                        height="100"
                        fill="white"
                        animate={{ y: height }}
                        transition={{
                            duration: 1,
                            type: "spring",
                            damping: 10,
                        }}
                    />
                </mask>
            </defs>

            <g clipPath="url(#clip0_53_10)">
                <motion.path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M86.6271 64.631C85.8051 84.2619 69.6369 99.9263 49.8039 99.9263C29.4451 99.9263 12.9412 82.8674 12.9412 63.0635C12.9412 60.4165 12.8937 55.1263 16.8627 46.2008C19.238 40.8592 20.7278 37.5035 21.5686 34.4361C22.0306 32.7502 22.929 30.0717 25.4902 34.4361C27.0004 37.0094 27.0588 40.7106 27.0588 40.7106C27.0588 40.7106 32.6776 36.3988 36.4706 28.1616C42.031 16.0859 37.5945 8.86744 36.0784 3.84783C35.5537 2.11136 35.2243 -1.00943 38.8235 0.318417C42.491 1.67175 52.1867 8.45881 57.2549 15.6125C64.4882 25.8223 67.0588 35.6125 67.0588 35.6125C67.0588 35.6125 69.3749 32.738 70.1961 29.7302C71.1235 26.3337 71.1372 22.9698 74.1172 26.5933C76.9514 30.0392 81.1604 36.5149 83.5294 42.6714C87.831 53.8514 86.6271 64.631 86.6271 64.631Z"
                    fill="#eee"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                />

                <motion.path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M86.6271 64.631C85.8051 84.2619 69.6369 99.9263 49.8039 99.9263C29.4451 99.9263 12.9412 82.8674 12.9412 63.0635C12.9412 60.4165 12.8937 55.1263 16.8627 46.2008C19.238 40.8592 20.7278 37.5035 21.5686 34.4361C22.0306 32.7502 22.929 30.0717 25.4902 34.4361C27.0004 37.0094 27.0588 40.7106 27.0588 40.7106C27.0588 40.7106 32.6776 36.3988 36.4706 28.1616C42.031 16.0859 37.5945 8.86744 36.0784 3.84783C35.5537 2.11136 35.2243 -1.00943 38.8235 0.318417C42.491 1.67175 52.1867 8.45881 57.2549 15.6125C64.4882 25.8223 67.0588 35.6125 67.0588 35.6125C67.0588 35.6125 69.3749 32.738 70.1961 29.7302C71.1235 26.3337 71.1372 22.9698 74.1172 26.5933C76.9514 30.0392 81.1604 36.5149 83.5294 42.6714C87.831 53.8514 86.6271 64.631 86.6271 64.631Z"
                    fill="url(#paint0_linear_53_10)"
                    mask="url(#flameMask)"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                />

                <motion.path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M49.8039 99.9263C35.7259 99.9263 24.3137 88.5141 24.3137 74.4361C24.3137 65.9416 27.7369 60.7843 34.8612 53.7906C39.4227 49.3126 43.6922 43.8126 45.5067 40.0675C45.8639 39.3302 46.6769 35.4882 49.8114 39.9867C51.4557 42.3459 54.0333 46.5416 55.6863 50.1224C58.5357 56.2961 59.2157 62.2792 59.2157 62.2792C59.2157 62.2792 62.0082 60.6337 63.9216 56.3969C64.5384 55.0314 65.7855 49.862 69.2718 55.0306C71.8298 58.8235 75.3439 65.6431 75.2941 74.4361C75.2941 88.5141 63.8816 99.9263 49.8039 99.9263Z"
                    fill="#FC9502"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                />

                <motion.path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M50.1961 72.0831C53.8235 72.0831 53.8235 78.8004 58.4314 87.7694C61.4996 93.7416 56.9102 99.9263 50.1961 99.9263C43.482 99.9263 40 94.4835 40 87.7694C40 81.0557 46.5686 72.0831 50.1961 72.0831Z"
                    fill="#FCE202"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.6, type: "spring" }}
                />
            </g>
        </motion.svg>
    )
}

export default FlameFill
