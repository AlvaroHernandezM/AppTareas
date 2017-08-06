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
            if(!$task){ //verifica que exista la tarea
                return response()->json(['status' => false, 'data' =>'Tarea no existente'], 404);
            }
            return response()->json($task,200);
        } catch (\Exception $e){ //una validacion no esperada y se escribe en log
            Log::critical("No mostro tarea: {$e->getCode()} , {$e->getLine()}, {$e->getMessage()}");
            return response(['status' => true, 'data' => 'Algo salio mal, contactarse con Administrador'], 500);        }
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
            if(!$task){ //verifica que exista la tarea
                return response()->json(['status' => false, 'data' =>'Tarea no existente'], 404);
            }
            if($task->user_id!=$request->user_id){ //verifica que coincide el usuario
                return response()->json(['status' => false, 'data' =>'Usuario no coincide'], 404);
            }
            $taskEqualName = Task::where('name',$request->input('name'))->first();
            if($taskEqualName->name == $task->name){ //verifica que no exista otra tarea con ese nombre
                $task->update([
                    'name' => $request->input('name'),
                ]);
            } else {
               return response()->json(['status' => false, 'data' =>'Otra tarea ya tiene este nombre'], 404);
            }
            if(!is_null($request->input('description'))){ //verifica si se envio la descripcion para actualizar
                $task->update([
                    'description' => $request->input('description'),
                ]);
            }
            if(!is_null($request->input('status'))){ //verifica si se envio el estado para actualizar
                $task->update([
                    'status' => $request->input('status'),
                ]);
            }
            return response()->json(['status' => true, 'data' => 'actualizada'], 200);
        } catch(\Exception $e){ //una validacion no esperada y se escribe en log
            Log::critical("No actualizo tarea: {$e->getCode()} , {$e->getLine()}, {$e->getMessage()}");
            return response(['status' => false, 'data' => 'Algo salio mal, contactarse con Administrador'], 500);
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
            if(!$task){ //verifica que exista la tarea
                return response()->json(['status' => false, 'data' => 'Tarea no existente'], 404);
            }
            $task->delete();
            return response()->json(['status' => 'success', 'data' =>"Tarea eliminada correctamente"], 200);
        } catch (\Exception $e){ //una validacion no esperada y se escribe en log
            Log::critical("No elimino tarea: {$e->getCode()} , {$e->getLine()}, {$e->getMessage()}");
            return response(['status' => false, 'data' => 'Algo salio mal, contactarse con Administrador'], 500);        }
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

            if ($validator->fails()) { //verifica las validaciones con las reglas definidas anteriormente
                return response()->json(['status' => false, 'data' => $validator->errors()], 404);
            }

            $user = User::find($request->user_id);
            if (is_null($user)) { //verificar si existe el usuario
                $user = User::where('email',$request->user_email)
                    ->first();
                if(is_null($user)){ //no existe alguien con ese correo
                    $user = new User();
                    $user->id = $request->user_id;
                    $user->name = $request->user_name;
                    $user->email = $request->user_email;
                    $user->save();
                } else {
                    return response()->json(['status' => false, 'data' => "Correo electronicos registrado con otra cuenta"], 404);
                }
            }
            $task = new Task([
                'name' => $request->input('name'),
                'description' => $request->input('description'),
                'user_id' => $request->input('user_id'),
            ]);
            $task->save();
            return response()->json(['status' => true, 'data' => 'tarea_guardada'], 200);
        } catch (\Exception $e) { //una validacion no esperada y se escribe en log
            Log::critical("No almaceno tarea: {$e->getCode()} , {$e->getLine()}, {$e->getMessage()}");
            return response(['status' => true, 'data' => 'Algo salio mal, contactarse con Administrador'], 500);        }
    }

    /**
     * meotod que permite cambiar a 1 (cerrado ) el estado de una tarea por medio
     * del id de la tarea y del usuario
     **/
    public function close(Request $request){
        if($request->id && $request->user_id){ //verifica que no sea null
            $task = Task::find($request->id);
            if(!$task){ //verifica si la tarea existe
                return response()->json(['status' => false, 'data' =>'Tarea no existente'], 404);
            }
            if($task->user_id!=$request->user_id){ //verifica que el usuario de la tarea coincida con el de la peticion
                return response()->json(['status' => false, 'data' =>'Usuario no coincide'], 404);
            }
            $task->update(['status' => 1]);
            return response()->json(['status' => true, 'data' => 'tarea_cerrada'], 200);
        } else {
            return response()->json(['status' => false, 'data' => 'Parametro incorrecto'],500);
        }
    }

    /**
     * meotod que permite cambiar a 0 (abierto) el estado de una tarea por medio
     * del id de la tarea y del usuario
     **/
    public function open(Request $request){
        if($request->id && $request->user_id){ //verifica que no sea null
            $task = Task::find($request->id);
            if(!$task){ //verifica si la tarea existe
                return response()->json(['status' => false, 'data' => 'Tarea no existente'], 404);
            }
            if($task->user_id!=$request->user_id){  //verifica que el usuario de la tarea coincida con el de la peticion
                return response()->json(['status' => false, 'data' => 'Usuario no coincide'], 404);
            }
            $task->update(['status' => 0]);
            return response()->json(['status' => true, 'data' => 'Tarea abierta'], 200);
        } else {
            return response()->json(['status' => false, 'data' => 'Parametro incorrecto'],500);
        }
    }
}
