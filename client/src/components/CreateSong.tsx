import { useState, useEffect } from "react";
import { Loader } from "../components/Loader";
import MusicVisualizer from "./MusicVisualizer";
import { InputField } from "./InputField";
import { ToastContainer, toast } from "react-toastify";

export const CreateSong = () => {
  const [taskId, setTaskId] = useState("");

  const [songDetails, setSongDetails] = useState<{
    title: "";
    prompt: "";
    tags: "";
    imageUrl: "";
    audioUrl: "";
    songId: "";
  } | null>(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    prompt: "",
    title: "",
    style: "",
  });

  const createTask = async (prompt: string, style: string, title: string) => {
    if (!prompt || !style || !title) {
      return toast("Please enter all the fields", {
        hideProgressBar: true,
        theme: "dark",
      });
    }

    setLoading(true);
    try {
      const response = await fetch(
        "http://localhost:3000/api/v1/suno/generate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            prompt,
            style,
          }),
        }
      );
      const data = await response.json();
      // Aquí se asume que la respuesta contiene data.taskId
      setTaskId(data.data.taskId);
      console.log("Task created:", data);
    } catch (error) {
      console.error("Error al crear la tarea:", error);
    }
  };

  useEffect(() => {
    let interval;
    if (taskId) {
      interval = setInterval(async () => {
        try {
          const response = await fetch(
            `http://localhost:3000/api/v1/suno/details/${taskId}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          if (!response.ok) {
            console.error(`Error en la petición: ${response.status}`);
            return;
          }
          const data = await response.json();

          // Suponiendo que la respuesta tenga una propiedad 'status' en data.data.status
          const currentStatus = data.data.status;
          setStatus(currentStatus);
          console.log("Estado actual:", currentStatus);

          // Si el estado ya no es PENDING, detenemos el polling y actualizamos la info de la canción
          if (
            currentStatus !== "PENDING" &&
            currentStatus !== "CREATE_TASK_FAILED" && // Puedes manejar errores de forma particular
            currentStatus !== "GENERATE_AUDIO_FAILED" &&
            currentStatus !== "CALLBACK_EXCEPTION" &&
            currentStatus !== "SENSITIVE_WORD_ERROR"
          ) {
            clearInterval(interval);
            // Asumimos que los detalles de la canción vienen en data.data.response.sunoData[0]
            const details = data.data.response?.sunoData[0];
            if (details) {
              setSongDetails({
                title: details.title,
                prompt: details.prompt,
                tags: details.tags,
                imageUrl: details.imageUrl,
                audioUrl: details.audioUrl,
                songId: details.id,
              });
            }
            setLoading(false);
          } else if (
            currentStatus === "CREATE_TASK_FAILED" ||
            currentStatus === "GENERATE_AUDIO_FAILED" ||
            currentStatus === "CALLBACK_EXCEPTION" ||
            currentStatus === "SENSITIVE_WORD_ERROR"
          ) {
            // Si ocurre un error, detenemos el polling y manejamos el error según corresponda
            clearInterval(interval);
            setLoading(false);
            console.error("The task failed with status :", currentStatus);
            toast("Sorry, the task failed", {
              hideProgressBar: true,
              theme: "dark",
            });
          }
        } catch (err) {
          console.error("Error al obtener detalles de la tarea:", err);
          toast("Sorry, the task failed", {
            hideProgressBar: true,
            theme: "dark",
          });
        }
      }, 5000);
    }

    // Limpieza del intervalo cuando el componente se desmonta o taskId cambia
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [taskId]);

  return (
    <main className="min-h-screen bg-black p-5 pt-10 flex flex-col items-center">
      <div className={`flex items-center justify-around text-white ${loading && 'w-full'}`}>
        <div
          className={`${
            songDetails || loading ? "w-[40%]" : "w-[100%]"
          } flex justify-center items-center flex-col gap-10 `}
        >
          <ToastContainer />
          <InputField
            name="prompt"
            placeholder="Bring yout idea to life"
            type="text"
            value={form.prompt}
            handleChange={(e) => setForm({ ...form, prompt: e.target.value })}
            label="Insert a prompt to generate a song"
            isSurpriseMe
          />
          <InputField
            name="style"
            placeholder="Tango, rock, indie"
            type="text"
            value={form.style}
            handleChange={(e) => setForm({ ...form, style: e.target.value })}
            label="Insert the style of your music"
          />
          <InputField
            name="title"
            placeholder="Random song"
            type="text"
            value={form.title}
            handleChange={(e) => setForm({ ...form, title: e.target.value })}
            label="Insert the title of your song"
          />
          <button
            onClick={() => createTask(form.prompt, form.style, form.title)}
            className="text-white bg-purple-900 p-3 rounded-lg cursor-pointer"
          >
            Create Song
          </button>
        </div>
        <aside className="w-[60%] flex items-center justify-center">
          {songDetails && (
            <div className="text-center flex flex-col items-center justify-center gap-10">
              <h2 className="text-2xl">Details of the song</h2>
              <p>Prompt: {songDetails.prompt}</p>
              <p>Title: {songDetails.title}</p>
              <p>Style: {songDetails.tags}</p>
              {songDetails.imageUrl && (
                <img src={songDetails.imageUrl} alt="Imagen de la canción" />
              )}
              {songDetails.audioUrl && (
                <audio controls src={songDetails.audioUrl}>
                  Tu navegador no soporta la reproducción de audio.
                </audio>
              )}
            </div>
          )}
          {loading && (
            
            <div
              role="status"
              className="max-w-sm w-[40rem] p-4 border border-gray-200 rounded-sm shadow-sm animate-pulse md:p-6 dark:border-gray-700"
            >
              <div className="my-5">
              <p className="text-white text-lg">We are creating your song.... </p>
              <p className="text-white text-sm">This could take up to 1 minute </p>
              <Loader />
              </div>
              <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
              <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
              <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
              <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
              <div className="flex items-center justify-center h-48 mb-4 bg-gray-300 rounded-sm dark:bg-gray-700">
                <svg
                  className="w-10 h-10 text-gray-200 dark:text-gray-600"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 16 20"
                >
                  <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM10.5 6a1.5 1.5 0 1 1 0 2.999A1.5 1.5 0 0 1 10.5 6Zm2.221 10.515a1 1 0 0 1-.858.485h-8a1 1 0 0 1-.9-1.43L5.6 10.039a.978.978 0 0 1 .936-.57 1 1 0 0 1 .9.632l1.181 2.981.541-1a.945.945 0 0 1 .883-.522 1 1 0 0 1 .879.529l1.832 3.438a1 1 0 0 1-.031.988Z" />
                  <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z" />
                </svg>
              </div>
              <span className="sr-only">Loading...</span>
            </div>
          )}
        </aside>
      </div>
      <button className="my-10 rounded-xl py-2 px-10 bg-[#D94AA7] text-white cursor-pointer">
        Visualize it
      </button>
    </main>
  );
};
