<?php

namespace App\Http\Controllers;

use App\User;
use App\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class UserController extends Controller
{


    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $users = User::all()->toArray();
        return response()->json($users);
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
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        try{
            $user = new User([
                'name' => $request->input('name'),
                'email' => $request->input('email'),
                'password' =>bcrypt($request->input('password')),
            ]);
            $user->save();
            return response()->json(['status'=>true,'Muy bien'],200);
        } catch (\Exception $e){
            Log::critical("No almaceno usuario: {$e->getCode()} , {$e->getLine()}, {$e->getMessage()}");
            return response('Something bad', 500);
        }
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
            $user = User::find($id);
            if(!$user){
                return response()->json(['Usuario no existente'], 404);
            }
            return response()->json($user,200);
        } catch (\Exception $e){
            Log::critical("No mostro usuario: {$e->getCode()} , {$e->getLine()}, {$e->getMessage()}");
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
        //
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
            $user = User::find($id);
            if(!$user){
                return response()->json(['Usuario no existente'], 404);
            }

            $user->delete();
            return response()->json("Usuario eliminado correctamente", 200);
        } catch (\Exception $e){
            Log::critical("No elimino usuario: {$e->getCode()} , {$e->getLine()}, {$e->getMessage()}");
            return response(['status' => true, 'data' => 'Algo salio mal, contactarse con Administrador'], 500);
        }
    }

    public function tasksOwner($id){
        try{
            $tasks = Task::where('user_id', $id)->get()->toArray();
            return response()->json($tasks);
        } catch (\Exception $e){
            Log::critical("No encuentro mis tareas: {$e->getCode()} , {$e->getLine()}, {$e->getMessage()}");
            return response(['status' => true, 'data' => 'Algo salio mal, contactarse con Administrador'], 500);
        }
    }

    public function myName($id){
        try{
            $user = User::find($id);
            if(!$user){
                return response()->json(['Usuario no existente'], 404);
            }
            return response()->json(['name'=> $user->name]);
        } catch(\Exception $e){
            Log::critical("No encuentro mi nombre: {$e->getCode()} , {$e->getLine()}, {$e->getMessage()}");
            return response(['status' => true, 'data' => 'Algo salio mal, contactarse con Administrador'], 500);
        }
    }
}
