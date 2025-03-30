import Link from 'next/link'
import React from 'react'

const page = () => {
    return (
        <section className="py-24  items-center justify-center mt-10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-12">
                    <h2 className="font-manrope text-5xl text-center font-bold bg-gradient-to-r from-green-500 via-green-400 to-green-300 bg-clip-text text-transparent ">
                        Our team{" "}
                    </h2>
                </div>
                <div className="grid grid-cols-1 min-[500px]:grid-cols-2 md:grid-cols-4 gap-8 max-w-xl mx-auto md:max-w-3xl lg:max-w-full">
                    <div className="block group">
                        <div className="relative mb-6">
                            <Link href="https://github.com/harshu-kasyap">
                                <img
                                    src="/harsh.jpeg"
                                    alt="harsh"
                                    className="w-40 h-40 rounded-full mx-auto transition-all duration-500 object-cover border border-solid border-transparent group-hover:border-green-600"
                                />
                            </Link>
                        </div>
                        <h4 className="text-xl font-semibold mb-2 capitalize text-center transition-all duration-500 bg-gradient-to-r from-green-600 via-green-500 to-green-300 bg-clip-text text-transparent group-hover:text-green-600">
                            Kumar Harsh{" "}
                        </h4>
                        <span className="text-gray-500 text-center block transition-all duration-500 group-hover:text-gray-900">
                            AI/ML Developer
                        </span>
                    </div>
                    <div className="group">
                        <div className="relative mb-6">
                            <Link href="https://linktr.ee/DevyManish">
                                <img
                                    src="https://pbs.twimg.com/profile_images/1871266006762741760/07umDlj1_400x400.jpg"
                                    alt="manish"
                                    className="w-40 h-40 rounded-full mx-auto transition-all duration-500 object-cover border border-solid border-transparent group-hover:border-green-600"
                                />
                            </Link>
                        </div>

                        <h4 className="text-xl font-semibold bg-gradient-to-r from-green-600 via-green-500 to-green-300 bg-clip-text text-transparent group-hover:text-green-600 mb-2 capitalize text-center transition-all duration-500">
                            Manish Gupta{" "}
                        </h4>
                        <span className="text-gray-500 text-center block transition-all duration-500 group-hover:text-gray-900">
                            Full Stack Developer
                        </span>
                    </div>
                    <div className="block group">
                        <div className="relative mb-6">
                            <Link href="https://github.com/debojyoti0645">
                                <img
                                    src="https://avatars.githubusercontent.com/u/133235526?v=4"
                                    alt="debojyoti debnath"
                                    className="w-40 h-40 rounded-full mx-auto transition-all duration-500 object-cover border border-solid border-transparent group-hover:border-green-600"
                                />
                            </Link>
                        </div>
                        <h4 className="text-xl font-semibold mb-2 capitalize text-center transition-all duration-500 bg-gradient-to-r from-green-600 via-green-500 to-green-300 bg-clip-text text-transparent group-hover:text-green-600">
                            Debojyoti Debnath{" "}
                        </h4>
                        <span className="text-gray-500 text-center block transition-all duration-500 group-hover:text-gray-900">
                            Android Developer
                        </span>
                    </div>
                    <div className="block group">
                        <div className="relative mb-6">
                            <Link href="https://github.com/sahilDas04">
                                <img
                                    src="/sahil.jpeg"
                                    alt="sahil image"
                                    className="w-40 h-40 rounded-full mx-auto transition-all duration-500 object-cover border border-solid border-transparent group-hover:border-green-600"
                                />
                            </Link>
                        </div>
                        <h4 className="text-xl font-semibold mb-2 capitalize text-center transition-all duration-500 bg-gradient-to-r from-green-600 via-green-500 to-green-300 bg-clip-text text-transparent group-hover:text-green-600">
                            Sahil Das
                        </h4>
                        <span className=" text-center block transition-all duration-500 text-green-900 group-hover:text-green-600">
                            AI/ML Developer
                        </span>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default page
