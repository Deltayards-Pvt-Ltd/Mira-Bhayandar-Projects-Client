export default function ProjectMahaReraDetails({ project }) {
  const reraScannerImageData = Array.isArray(project?.reraScannerImage)
    ? project.reraScannerImage
    : [];

  if (!reraScannerImageData.length) return null;

  return (
    <div className="border-b border-navy/[0.08] bg-[#fdfbf7] text-navy">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <section aria-labelledby="project-maharera-heading">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-ink">
            Rera Verification
          </p>
          <h2
            id="project-maharera-heading"
            className="mt-2 text-3xl font-normal tracking-tight text-navy sm:text-4xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            MAHARERA
          </h2>
          <div className="mt-6 flex items-center justify-center text-base leading-[1.75] text-navy/78 sm:text-lg">
            <p className="mx-auto max-w-2xl text-center leading-8 text-gray-600">
              Scan the QR code below with your phone camera to verify the
              project registration on the Maharashtra RERA portal.
            </p>
          </div>

          {reraScannerImageData.length === 1 ? (
            <div className="mx-auto mt-6 max-w-md rounded-2xl border border-navy/12 bg-gray-200 p-4 text-center text-navy shadow-[0_2px_6px_rgba(10,22,40,0.09),0_14px_44px_-4px_rgba(10,22,40,0.18)]">
              <div className="mb-2">
                <img
                  src={reraScannerImageData[0].image}
                  alt={reraScannerImageData[0].title}
                  className="mx-auto h-52 w-52 object-cover"
                />
              </div>
              <div className="border-t border-[#ece7df] pt-2">
                <h3 className="font-serif text-xl text-[#0d1b3e]">
                  {reraScannerImageData[0].title}
                </h3>
              </div>
            </div>
          ) : (
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4 sm:grid sm:grid-cols-2 md:grid-cols-3">
              {reraScannerImageData.map((item) => (
                <div
                  key={item.title ?? item.image}
                  className="mx-auto max-w-md rounded-2xl border border-navy/12 bg-gray-200 p-4 text-center text-navy shadow-[0_2px_6px_rgba(10,22,40,0.09),0_14px_44px_-4px_rgba(10,22,40,0.18)]"
                >
                  <div className="mb-2">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="mx-auto h-52 w-52 object-cover"
                    />
                  </div>
                  <div className="border-t border-[#ece7df] pt-2">
                    <h3 className="font-serif text-xl text-[#0d1b3e]">
                      {item.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
