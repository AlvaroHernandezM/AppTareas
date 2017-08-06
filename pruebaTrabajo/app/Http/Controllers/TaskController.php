<?php

namespace App\Http\Controllers;

use App\Http\Requests\TaskRequest;
use Illuminate\Http\Request;
use App\Task;
use App\User;
use Illuminate\Support\Facades\Log;
use Validator;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $tasks = Task::all()->toArray();
        return response()->json($tasks);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        try{
            $task = Task::find($id);
            if(!$task){
                return response()->json(['Tarea no existente'], 404);
            }
            return response()->json($task,200);
        } catch (\Exception $e){
            Log::critical("No mostro tarea: {$e->getCode()} , {$e->getLine()}, {$e->getMessage()}");
            return response('Something bad', 500);
        }
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        try{
            $task = Task::find($id);
            $task->update([
                'name' => $request->input('name'),
                'status' => $request->input('status'),
                'description' => $request->input('description'),
            ]);
            return response()->json(['status' => true, 'actualizada'], 200);
        } catch(\Exception $e){
            Log::critical("No actualizo tarea: {$e->getCode()} , {$e->getLine()}, {$e->getMessage()}");
            return response('Something bad', 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        try{
            $task = Task::find($id);
            if(!$task){
                return response()->json(['Tarea no existente'], 404);
            }
            $task->delete();
            return response()->json("Tarea eliminada correctamente", 200);
        } catch (\Exception $e){
            Log::critical("No elimino tarea: {$e->getCode()} , {$e->getLine()}, {$e->getMessage()}");
            return response('Something bad', 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        try {
            $rules = [
                'name' => 'required|unique:tasks|max:120',
                'user_id' => 'required',
                'user_name' => 'required',
                'user_email' => 'required',
            ];

            $messages = [
                'name.unique' => 'No se puede repetir el nombre de una tarea',
                'name.required' => 'Es requerido el nombre de la tarea',
                'user_id.required' => 'Es requerido el id del usuario',
                'user_name.required' => 'Es requerido el nombre del usuario',
                'user_email.required' => 'Es requerido el correo del usuario',
            ];

            $validator = Validator::make($request->all(),$rules,$messages);

            if ($validator->fails()) {
                return response()->json(['status' => false, $validator->errors()], 404);
            }

            $this->userVerification($request);

            $task = new Task([
                'name' => $request->input('name'),
                'description' => $request->input('description'),
                'user_id' => $request->input('user_id'),
            ]);
            $task->save();
            return response()->json(['status' => true, 'guardado'], 200);
        } catch (\Exception $e) {
            Log::critical("No almaceno tarea: {$e->getCode()} , {$e->getLine()}, {$e->getMessage()}");
            return response('Something bad', 500);
        }
    }
    
    /*
     * Verifica que si el usuario aun no esta en la base de datos, lo almacena
     */
    private function userVerification(Request $request){
        $user = User::find($request->user_id);
        if (is_null($user)) { // No existe
            $user = new User();
            $user->id = $request->user_id;
            $user->name = $request->user_name;
            $user->email = $request->user_email;
            $user->save();
        }
    }

}
