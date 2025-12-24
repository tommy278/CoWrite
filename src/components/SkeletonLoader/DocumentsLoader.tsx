const PAGE_SIZE = 24
const PAGE_SIZE_ARRAY = Array.from({ length: PAGE_SIZE }, (_, index) => index)

export default function DocumentsLoader() {
  return (
    <>
      <div className="m-2 flex animate-pulse items-center justify-between rounded-sm bg-gray-400 p-2 md:mx-5">
        <div className="h-5 w-5 md:h-5 md:w-5" />
      </div>
      <div className="grid w-full animate-pulse grid-cols-3 gap-2 px-5 md:grid-cols-4 md:gap-5">
        {PAGE_SIZE_ARRAY.map((index) => (
          <div
            key={index}
            className="my-2 flex min-w-0 flex-col rounded-sm bg-gray-400"
          >
            <div className="view-height"></div>
            <div className="w-full px-1 py-2 md:px-2 md:py-4">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <h1 className="header-size invisible text-sm font-semibold"></h1>
                  <p className="time-size invisible">
                    <span className="invisible mr-0.5 md:mr-1"></span>
                  </p>
                </div>
                <button
                  aria-label="Open Menu"
                  className="z-50 cursor-pointer rounded-full p-2"
                >
                  <div className="icon" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
