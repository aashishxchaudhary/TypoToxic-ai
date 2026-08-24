import { AlertTriangle, RotateCcw } from "lucide-react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function ResultGraph({ analysis, duration, mode, onRestart }) {
  const data = analysis?.chartData?.length
    ? analysis.chartData
    : [{ time: duration, wpm: analysis?.wpm || 0, raw: analysis?.rawWpm || 0, burst: analysis?.burstWpm || 0, errors: analysis?.wrongChars || 0 }];

  return <section className="border-t border-yellow-400/10 bg-[#070b12] p-5 md:p-7">
    <div className="grid gap-6 lg:grid-cols-[180px_1fr]">
      <div>
        <div className="font-mono text-sm text-slate-600">wpm</div>
        <div className="font-mono text-6xl text-yellow-400">{analysis.wpm}</div>
        <div className="mt-4 font-mono text-sm text-slate-600">acc</div>
        <div className="font-mono text-5xl text-yellow-400">{analysis.accuracy}%</div>
        <div className="mt-7 font-mono text-xs leading-6 text-slate-500">
          <div>test type</div>
          <div className="text-yellow-400">time {duration}</div>
          <div className="text-yellow-400">{mode}</div>
        </div>
      </div>
      <div className="min-h-[260px]">
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={data} margin={{ top: 12, right: 18, left: 0, bottom: 8 }}>
            <CartesianGrid stroke="#1d242d" strokeDasharray="3 3"/>
            <XAxis dataKey="time" stroke="#5c6570" fontSize={11}/>
            <YAxis yAxisId="speed" stroke="#5c6570" fontSize={11}/>
            <YAxis yAxisId="errors" orientation="right" stroke="#5c6570" fontSize={11}/>
            <Tooltip contentStyle={{ background: "#05070b", border: "1px solid #202833", borderRadius: 8 }} labelFormatter={(value) => `${value}s`}/>
            <Line yAxisId="speed" type="monotone" dataKey="raw" stroke="#eab308" strokeWidth={3} dot={false} strokeDasharray="7 6"/>
            <Line yAxisId="speed" type="monotone" dataKey="wpm" stroke="#facc15" strokeWidth={3} dot={false}/>
            <Line yAxisId="speed" type="monotone" dataKey="burst" stroke="#6b7280" strokeWidth={3} dot={false}/>
            <Line yAxisId="errors" type="monotone" dataKey="errors" stroke="#fb7185" strokeWidth={0} dot={{ r: 4 }}/>
          </LineChart>
        </ResponsiveContainer>
        <div className="mt-5 grid grid-cols-2 gap-x-10 gap-y-5 lg:grid-cols-[repeat(5,minmax(130px,1fr))]">
          {[["raw", analysis.rawWpm], ["characters", `${analysis.correctChars}/${analysis.wrongChars}`], ["consistency", `${analysis.consistency}%`], ["time", `${duration}s`], ["combo", analysis.comboBest]].map(([label, value]) => <div key={label} className="min-w-[130px]">
            <div className="font-mono text-sm text-slate-600">{label}</div>
            <div className="whitespace-nowrap font-mono text-3xl text-yellow-400">{value}</div>
          </div>)}
        </div>
        <div className="mt-6 flex items-center justify-center gap-8 text-slate-600">
          <button onClick={onRestart} className="hover:text-yellow-400"><RotateCcw size={19}/></button>
          <span title="errors"><AlertTriangle size={19}/></span>
          <span className="font-mono text-xs">raw</span>
          <span className="font-mono text-xs text-yellow-400">wpm</span>
          <span className="font-mono text-xs">burst</span>
          <span className="font-mono text-xs text-rose-400">errors</span>
        </div>
      </div>
    </div>
  </section>;
}
